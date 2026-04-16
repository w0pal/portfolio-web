import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { fetchMediumPosts } from '../_lib/medium'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string

  if (req.method === 'GET') {
    try {
      // Try DB first
      const dbPost = await prisma.blogPost.findUnique({ where: { slug } })
      if (dbPost) return res.json(dbPost)

      // Try Medium
      const mediumUsername = process.env.MEDIUM_USERNAME || ''
      const mediumPosts = await fetchMediumPosts(mediumUsername)
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

      return res.status(404).json({ error: 'Post not found' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch post' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, content, coverImage, source, originalLink, slug: newSlug } = req.body
      const post = await prisma.blogPost.update({
        where: { slug },
        data: { title, description, content, coverImage, source, originalLink, slug: newSlug || slug },
      })
      return res.json(post)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to update post' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.blogPost.delete({ where: { slug } })
      return res.json({ message: 'Post deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete post' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
