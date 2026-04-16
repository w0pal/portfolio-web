import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.portfolioItem.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return res.json(items)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch items' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, link, imageUrl, tags } = req.body
      const item = await prisma.portfolioItem.create({
        data: { title, description, link, imageUrl, tags: JSON.stringify(tags) },
      })
      return res.json(item)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create item' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
