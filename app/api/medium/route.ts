import { NextResponse } from 'next/server';

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
   return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const rssUrl = `https://medium.com/feed/@${username}`;

  console.log('Fetching Medium RSS from:', rssUrl);

  // Use RSS2JSON API as a proxy to bypass CORS and Cloudflare issues
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
   rssUrl
  )}`;

  const response = await fetch(apiUrl, {
   headers: {
    Accept: 'application/json',
   },
   next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
   throw new Error(
    `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
   );
  }

  const data = await response.json();

  if (data.status !== 'ok') {
   throw new Error(data.message || 'Failed to parse RSS feed');
  }

  const posts = data.items.map((item: any) => {
   // Extract thumbnail from content or use provided thumbnail
   let thumbnail = item.thumbnail || '';

   if (!thumbnail && item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
     thumbnail = imgMatch[1];
    }
   }

   // Clean and truncate description
   let description = '';
   if (item.description) {
    const cleanDesc = item.description.replace(/<[^>]+>/g, '').trim();
    description = cleanDesc.substring(0, 150);
    if (description.length >= 150) {
     description += '...';
    }
   }

   if (!description) {
    description = 'Baca selengkapnya...';
   }

   return {
    title: item.title || '',
    link: item.link || item.guid || '',
    pubDate: item.pubDate || '',
    description,
    thumbnail,
    categories: item.categories || [],
    author: item.author || username,
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
