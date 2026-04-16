import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function requireAuth(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// GET: Fetch all portfolio items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// GET: Fetch single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.portfolioItem.findUnique({ where: { id } })
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// POST: Create a new portfolio item (Admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, link, imageUrl, tags } = req.body
    const item = await prisma.portfolioItem.create({
      data: { title, description, link, imageUrl, tags: JSON.stringify(tags) },
    })
    res.json(item)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// PUT: Update portfolio item (Admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, link, imageUrl, tags } = req.body
    const item = await prisma.portfolioItem.update({
      where: { id },
      data: { title, description, link, imageUrl, tags: JSON.stringify(tags) },
    })
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' })
  }
})

// DELETE: Delete portfolio item (Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.portfolioItem.delete({ where: { id } })
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

export default router
