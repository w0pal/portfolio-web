import { XMLParser } from 'fast-xml-parser';
import { unstable_cache } from 'next/cache';

export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  categories: string[];
  author: string;
  slug: string;
  fullContent: string;
}

// Internal function to fetch posts
async function fetchMediumPostsInternal(
  username: string
): Promise<MediumPost[]> {
  try {
    if (!username) {
      console.error('Medium username is empty');
      return [];
    }

    const rssUrl = `https://medium.com/feed/@${username}`;

    // Fetch RSS feed directly from Medium (server-side only)
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour at fetch level
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS feed: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();

    // Parse XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);

    // Extract items from RSS feed
    const channel = result.rss?.channel || result.feed;
    if (!channel) {
      console.error('Invalid RSS feed structure');
      return [];
    }

    let items = channel.item || channel.entry || [];
    if (!Array.isArray(items)) {
      items = [items];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = items.map((item: any) => {
      // Extract thumbnail from content:encoded or description
      let thumbnail = '';
      const content =
        item['content:encoded'] || item.description || item.content || '';

      if (content) {
        const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }

      // Clean and truncate description
      let description = '';
      if (content) {
        const cleanDesc = content
          .replace(/<figure[^>]*>.*?<\/figure>/gi, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();
        description = cleanDesc.substring(0, 150);
        if (description.length >= 150) {
          description += '...';
        }
      }

      if (!description) {
        description = 'Baca selengkapnya...';
      }

      // Extract categories
      let categories: string[] = [];
      if (item.category) {
        categories = Array.isArray(item.category)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? item.category.map((c: any) =>
              typeof c === 'string' ? c : c['#text'] || c
            )
          : [
              typeof item.category === 'string'
                ? item.category
                : item.category['#text'] || '',
            ];
      }

      const title = item.title || '';
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
      };
    });

    return posts;
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

// Export cached version
export const fetchMediumPosts = unstable_cache(
  async (username: string) => fetchMediumPostsInternal(username),
  ['medium-posts'],
  { revalidate: 3600, tags: ['medium-posts'] }
);

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('id-ID', options);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getPostBySlug(
  username: string,
  slug: string
): Promise<MediumPost | null> {
  const posts = await fetchMediumPosts(username);
  return posts.find((post) => post.slug === slug) || null;
}
