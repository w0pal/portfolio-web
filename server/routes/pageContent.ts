import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function requireAuth(req: any, res: any, next: any) {
  if (!req.user || !(req.user as any).isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// GET: Fetch page content by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    })

    if (!page) {
      return res.status(404).json({ error: 'Page content not found' })
    }

    try {
      // Parse JSON before sending
      const content = JSON.parse(page.content)
      res.json(content)
    } catch (e) {
      res.json({ content: page.content })
    }
  } catch (error) {
    console.error(`Error fetching page content for ${req.params.slug}:`, error)
    res.status(500).json({ error: 'Failed to fetch page content' })
  }
})

// PUT: Update page content by slug (Admin only)
router.put('/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    const contentData = req.body

    // Store as JSON string
    const jsonContent = JSON.stringify(contentData)

    const page = await prisma.pageContent.upsert({
      where: { slug },
      update: { content: jsonContent },
      create: { slug, content: jsonContent },
    })

    res.json({ message: 'Content updated successfully' })
  } catch (error) {
    console.error(`Error updating page content for ${req.params.slug}:`, error)
    res.status(500).json({ error: 'Failed to update page content' })
  }
})

export default router
