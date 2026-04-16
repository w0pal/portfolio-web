import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string

  if (req.method === 'GET') {
    try {
      const post = await prisma.blogPost.findUnique({ where: { slug } })
      if (!post) return res.status(404).json({ error: 'Post not found' })

      const comments = await prisma.comment.findMany({
        where: { postId: post.id },
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'asc' },
      })
      return res.json(comments)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch comments' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { content } = req.body
      const post = await prisma.blogPost.findUnique({ where: { slug } })
      if (!post) return res.status(404).json({ error: 'Post not found' })

      // For comments without auth, create anonymous or return error
      return res.status(401).json({ error: 'Authentication required' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create comment' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
