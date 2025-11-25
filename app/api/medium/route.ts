import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
   return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const parser = new Parser({
   customFields: {
    item: ['content:encoded', 'description'],
   },
  });

  const rssUrl = `https://medium.com/feed/@${username}`;
  const feed = await parser.parseURL(rssUrl);

  const posts = feed.items.map((item: any) => {
   let thumbnail = '';
   const imgMatch = item['content:encoded']?.match(/<img[^>]+src="([^">]+)"/);
   if (imgMatch) {
    thumbnail = imgMatch[1];
   }

   // Improved description extraction
   let description = '';

   // Try contentSnippet first
   if (item.contentSnippet) {
    description = item.contentSnippet.substring(0, 150).trim();
   }
   // Try description field
   else if (item.description) {
    const cleanDesc = item.description.replace(/<[^>]+>/g, '').trim();
    description = cleanDesc.substring(0, 150);
   }
   // Try content:encoded as fallback
   else if (item['content:encoded']) {
    const cleanContent = item['content:encoded'].replace(/<[^>]+>/g, '').trim();
    description = cleanContent.substring(0, 150);
   }

   // Add ellipsis only if description exists and was truncated
   if (description && description.length >= 150) {
    description += '...';
   } else if (!description) {
    description = 'Baca selengkapnya...';
   }

   return {
    title: item.title || '',
    link: item.link || '',
    pubDate: item.pubDate || item.isoDate || '',
    description,
    thumbnail,
    categories: item.categories || [],
    author: item.creator || username,
   };
  });

  return NextResponse.json({ posts }, { status: 200 });
 } catch (error) {
  console.error('Error fetching Medium posts:', error);
  return NextResponse.json(
   { error: 'Failed to fetch Medium posts' },
   { status: 500 }
  );
 }
}
