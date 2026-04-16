import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { PrismaClient } from '@prisma/client'
import blogRoutes from './routes/blog'
import portfolioRoutes from './routes/portfolio'
import { fetchMediumPostsInternal, generateSlug } from './lib/medium'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean)

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

// Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (user) {
      done(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: adminEmails.includes(user.email || ''),
      })
    } else {
      done(null, false)
    }
  } catch (err) {
    done(err, false)
  }
})

// Find or create user from OAuth profile
async function findOrCreateUser(
  profile: any,
  provider: string,
  providerAccountId: string,
  accessToken?: string,
  refreshToken?: string
) {
  const email = profile.emails?.[0]?.value || null

  // Check if account already exists
  const existingAccount = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  })

  if (existingAccount) {
    return existingAccount.user
  }

  // Check if user with same email exists
  let user = email ? await prisma.user.findUnique({ where: { email } }) : null

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: profile.displayName || profile.username,
        email,
        image: profile.photos?.[0]?.value || null,
      },
    })
  }

  // Create account link
  await prisma.account.create({
    data: {
      userId: user.id,
      type: 'oauth',
      provider,
      providerAccountId,
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  })

  return user
}

// GitHub OAuth Strategy
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `${process.env.NEXTAUTH_URL || 'http://localhost:5173'}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const user = await findOrCreateUser(profile, 'github', profile.id, accessToken, refreshToken)
          done(null, user)
        } catch (err) {
          done(err, false)
        }
      }
    )
  )
}

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.NEXTAUTH_URL || 'http://localhost:5173'}/api/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const user = await findOrCreateUser(profile, 'google', profile.id, accessToken, refreshToken)
          done(null, user)
        } catch (err) {
          done(err, false)
        }
      }
    )
  )
}

// ===== Auth Routes =====
app.get('/api/auth/session', (req, res) => {
  if (req.user) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
})

app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/admin')
)

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
)

app.post('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' })
  })
})

app.get('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/')
  })
})

// ===== Blog route that merges local + Medium posts =====
app.get('/api/blog', async (req, res) => {
  try {
    const localPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const mediumUsername = process.env.MEDIUM_USERNAME || process.env.VITE_MEDIUM_USERNAME || ''
    let mediumPosts: any[] = []
    try {
      const raw = await fetchMediumPostsInternal(mediumUsername)
      mediumPosts = raw.map((post) => ({
        id: `medium-${post.slug}`,
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.fullContent,
        coverImage: post.thumbnail || null,
        source: 'MEDIUM',
        originalLink: post.link,
        published: true,
        createdAt: new Date(post.pubDate).toISOString(),
        updatedAt: new Date(post.pubDate).toISOString(),
        isFromMedium: true,
      }))
    } catch (e) {
      console.error('Failed to fetch Medium posts:', e)
    }

    const allPosts = [...localPosts, ...mediumPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    res.json(allPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// Blog detail - try DB first, then Medium
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    // Try DB first
    const dbPost = await prisma.blogPost.findUnique({ where: { slug } })
    if (dbPost) return res.json(dbPost)

    // Try Medium
    const mediumUsername = process.env.MEDIUM_USERNAME || process.env.VITE_MEDIUM_USERNAME || ''
    const mediumPosts = await fetchMediumPostsInternal(mediumUsername)
    const mediumPost = mediumPosts.find((p) => p.slug === slug)

    if (mediumPost) {
      return res.json({
        id: `medium-${mediumPost.slug}`,
        title: mediumPost.title,
        slug: mediumPost.slug,
        description: mediumPost.description,
        content: mediumPost.fullContent,
        coverImage: mediumPost.thumbnail || null,
        source: 'MEDIUM',
        originalLink: mediumPost.link,
        createdAt: new Date(mediumPost.pubDate).toISOString(),
        categories: mediumPost.categories,
        author: mediumPost.author,
      })
    }

    res.status(404).json({ error: 'Post not found' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// Mount remaining CRUD routes
app.use('/api/blog', blogRoutes)
app.use('/api/portfolio', portfolioRoutes)

// Start locally (Vercel will import the app directly)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] Express running on http://localhost:${PORT}`)
  })
}

export default app

