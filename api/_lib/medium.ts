import { XMLParser } from 'fast-xml-parser'

export interface MediumPost {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail?: string
  categories: string[]
  author: string
  slug: string
  fullContent: string
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function fetchMediumPosts(username: string): Promise<MediumPost[]> {
  if (!username) return []

  try {
    const rssUrl = `https://medium.com/feed/@${username}`
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    })

    if (!response.ok) return []

    const xmlText = await response.text()
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
    const result = parser.parse(xmlText)

    const channel = result.rss?.channel || result.feed
    if (!channel) return []

    let items = channel.item || channel.entry || []
    if (!Array.isArray(items)) items = [items]

    return items.map((item: any) => {
      const content = item['content:encoded'] || item.description || item.content || ''
      let thumbnail = ''
      if (content) {
        const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/i)
        if (imgMatch) thumbnail = imgMatch[1]
      }

      let description = ''
      if (content) {
        const clean = content
          .replace(/<figure[^>]*>.*?<\/figure>/gi, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').trim()
        description = clean.substring(0, 150)
        if (description.length >= 150) description += '...'
      }
      if (!description) description = 'Baca selengkapnya...'

      let categories: string[] = []
      if (item.category) {
        categories = Array.isArray(item.category)
          ? item.category.map((c: any) => typeof c === 'string' ? c : c['#text'] || c)
          : [typeof item.category === 'string' ? item.category : item.category['#text'] || '']
      }

      const title = item.title || ''
      return {
        title,
        link: item.link?.['@_href'] || item.link || item.guid || '',
        pubDate: item.pubDate || item.published || '',
        description,
        thumbnail,
        categories: categories.filter(Boolean),
        author: item['dc:creator'] || item.author?.name || item.author || username,
        slug: generateSlug(title),
        fullContent: content,
      }
    })
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
    return []
  }
}
