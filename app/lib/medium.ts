import { XMLParser } from 'fast-xml-parser';

export interface MediumPost {
 title: string;
 link: string;
 pubDate: string;
 description: string;
 thumbnail?: string;
 categories: string[];
 author: string;
}

export async function fetchMediumPosts(
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
   next: { revalidate: 3600 }, // Cache for 1 hour
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
     ? item.category.map((c: any) =>
        typeof c === 'string' ? c : c['#text'] || c
       )
     : [
        typeof item.category === 'string'
         ? item.category
         : item.category['#text'] || '',
       ];
   }

   return {
    title: item.title || '',
    link: item.link?.['@_href'] || item.link || item.guid || '',
    pubDate: item.pubDate || item.published || '',
    description,
    thumbnail,
    categories: categories.filter(Boolean),
    author: item['dc:creator'] || item.author?.name || item.author || username,
   };
  });

  return posts;
 } catch (error) {
  console.error('Error fetching Medium posts:', error);
  return [];
 }
}

export function formatDate(dateString: string): string {
 const date = new Date(dateString);
 const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
 };
 return date.toLocaleDateString('id-ID', options);
}
