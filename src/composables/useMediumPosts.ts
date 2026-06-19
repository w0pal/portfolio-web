import { ref, type Ref } from 'vue'
import { XMLParser } from 'fast-xml-parser'
import { mediumPosts as generatedMediumPosts } from '@/data/medium-posts'
import type { BlogPost } from '@/data/blog-posts'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

let sharedPosts: Ref<BlogPost[]> | null = null
let sharedLoading: Ref<boolean> | null = null
let sharedError: Ref<string | null> | null = null
let fetchInitiated = false

function parseMediumItem(item: any): BlogPost {
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
}

export function useMediumPosts() {
  if (!sharedPosts) {
    sharedPosts = ref<BlogPost[]>([...generatedMediumPosts])
    sharedLoading = ref(false)
    sharedError = ref<string | null>(null)
  }

  if (import.meta.env.DEV && !fetchInitiated) {
    fetchInitiated = true
    sharedLoading!.value = true

    ;(async () => {
      try {
        const res = await fetch('/api/medium/feed')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const xml = await res.text()
        const data = parser.parse(xml)
        const items = data?.rss?.channel?.item
        if (items) {
          const list = Array.isArray(items) ? items : [items]
          sharedPosts!.value = list.map(parseMediumItem)
        } else {
          sharedPosts!.value = []
        }
      } catch (e: any) {
        sharedError!.value = e.message
      } finally {
        sharedLoading!.value = false
      }
    })()
  }

  return { posts: sharedPosts!, loading: sharedLoading!, error: sharedError! }
}
