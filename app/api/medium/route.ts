import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
   return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const rssUrl = `https://medium.com/feed/@${username}`;

  console.log('Fetching Medium RSS from:', rssUrl);

  // Fetch RSS feed directly from Medium
  const response = await fetch(rssUrl, {
   headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
    Accept: 'application/rss+xml, application/xml, text/xml',
   },
   next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
   throw new Error(
    `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
   );
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
   throw new Error('Invalid RSS feed structure');
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
    // Try to find image in content
    const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (imgMatch) {
     thumbnail = imgMatch[1];
    }
   }

   // Clean and truncate description
   let description = '';
   if (content) {
    const cleanDesc = content
     .replace(/<figure[^>]*>.*?<\/figure>/gi, '') // Remove figure tags
     .replace(/<[^>]+>/g, '') // Remove HTML tags
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

  return NextResponse.json({ posts }, { status: 200 });
 } catch (error: any) {
  console.error('Error fetching Medium posts:', error);

  // More detailed error message
  const errorMessage = error?.message || 'Failed to fetch Medium posts';
  const errorDetails = {
   error: errorMessage,
   details: error?.code || error?.type || 'Unknown error',
   message: 'Pastikan username Medium sudah benar dan profil bersifat publik',
  };

  return NextResponse.json(errorDetails, { status: 500 });
 }
}
