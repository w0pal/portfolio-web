import { XMLParser } from 'fast-xml-parser'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.prod') })

const username = process.env.VITE_MEDIUM_USERNAME
if (!username) {
  console.log('VITE_MEDIUM_USERNAME not set — skipping Medium fetch')
  process.exit(0)
}

let xml
try {
  const res = await fetch(`https://medium.com/feed/@${username}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  xml = await res.text()
} catch (e) {
  console.error('Failed to fetch Medium RSS:', e.message)
  process.exit(0)
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

const data = parser.parse(xml)
const items = data?.rss?.channel?.item
if (!items) {
  console.log('No items found in Medium feed')
  process.exit(0)
}

const list = Array.isArray(items) ? items : [items]

const posts = list.map((item) => {
  const link = item.link || ''
  const slug = (link.split('/').pop() || '').split('?')[0]
  const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()
  const content = item['content:encoded'] || ''
  const plain = content.replace(/<[^>]+>/g, '').trim()
  const description = plain.substring(0, 250).trim() + (plain.length > 250 ? '...' : '')

  return {
    id: slug,
    title: item.title || 'Untitled',
    slug,
    description: description || null,
    content: content || null,
    coverImage: null,
    source: 'MEDIUM',
    originalLink: link || null,
    createdAt: pubDate.toISOString(),
    author: item['dc:creator'] || null,
    categories: item.category
      ? Array.isArray(item.category)
        ? item.category
        : [item.category]
      : [],
  }
})

const outputDir = resolve(process.cwd(), 'public/data')
try { mkdirSync(outputDir, { recursive: true }) } catch {}

writeFileSync(resolve(outputDir, 'medium-posts.json'), JSON.stringify(posts, null, 2), 'utf-8')
console.log(`Fetched ${posts.length} Medium posts for @${username}`)
