import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './_lib/prisma'
import { fetchMediumPosts } from './_lib/medium'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const localPosts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
      })

      const mediumUsername = process.env.MEDIUM_USERNAME || ''
      let mediumPosts: any[] = []
      try {
        const raw = await fetchMediumPosts(mediumUsername)
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

      return res.json(allPosts)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch posts' })
    }
  }

  // POST: Create blog post
  if (req.method === 'POST') {
    try {
      const { title, description, content, coverImage, source, originalLink, slug } = req.body
      const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

      const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } })
      if (existing) return res.status(400).json({ error: 'Slug already exists' })

      const post = await prisma.blogPost.create({
        data: { title, description, content, coverImage, source, originalLink, slug: finalSlug },
      })
      return res.json(post)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create post' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
