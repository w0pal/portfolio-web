import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string

  if (req.method === 'GET') {
    try {
      const item = await prisma.portfolioItem.findUnique({ where: { id } })
      if (!item) return res.status(404).json({ error: 'Item not found' })
      return res.json(item)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch item' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, link, imageUrl, tags } = req.body
      const item = await prisma.portfolioItem.update({
        where: { id },
        data: { title, description, link, imageUrl, tags: JSON.stringify(tags) },
      })
      return res.json(item)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update item' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.portfolioItem.delete({ where: { id } })
      return res.json({ message: 'Item deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete item' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
