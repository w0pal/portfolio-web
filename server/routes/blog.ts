import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function requireAuth(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// POST: Create a new blog post (Admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, content, coverImage, source, originalLink, slug } = req.body
    const finalSlug = slug || generateSlug(title)

    const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const post = await prisma.blogPost.create({
      data: { title, description, content, coverImage, source, originalLink, slug: finalSlug },
    })
    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// PUT: Update blog post
router.put('/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    const { title, description, content, coverImage, source, originalLink, slug: newSlug } = req.body

    const post = await prisma.blogPost.update({
      where: { slug },
      data: { title, description, content, coverImage, source, originalLink, slug: newSlug || slug },
    })
    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// DELETE: Delete blog post
router.delete('/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    await prisma.blogPost.delete({ where: { slug } })
    res.json({ message: 'Post deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

// GET comments for a post
router.get('/:slug/comments', async (req, res) => {
  try {
    const { slug } = req.params
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'asc' },
    })
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

// POST comment on a post
router.post('/:slug/comments', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    const { content } = req.body
    const userId = (req.user as any).id

    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const comment = await prisma.comment.create({
      data: { content, postId: post.id, authorId: userId },
      include: { author: { select: { name: true, image: true } } },
    })
    res.json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

export default router
