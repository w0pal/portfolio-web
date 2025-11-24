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
  // Medium RSS feed URL
  const rssUrl = `https://medium.com/feed/@${username}`;

  // Using RSS2JSON API to convert Medium RSS to JSON
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
   rssUrl
  )}`;

  const response = await fetch(apiUrl, {
   next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
   throw new Error('Failed to fetch Medium posts');
  }

  const data = await response.json();

  if (data.status !== 'ok') {
   throw new Error('RSS feed error');
  }

  const posts: MediumPost[] = data.items.map((item: any) => {
   // Extract thumbnail from content
   let thumbnail = '';
   const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
   if (imgMatch) {
    thumbnail = imgMatch[1];
   }

   // Clean description from HTML
   const description =
    item.description?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

   return {
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    description: description || '',
    thumbnail,
    categories: item.categories || [],
    author: item.author || username,
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
