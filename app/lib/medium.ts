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

  const response = await fetch(`/api/medium?username=${username}`, {
   cache: 'no-store', // Atau gunakan next: { revalidate: 3600 }
  });

  if (!response.ok) {
   const errorData = await response.json().catch(() => ({}));
   console.error('Failed to fetch Medium posts:', response.status, errorData);
   throw new Error('Failed to fetch Medium posts');
  }

  const data = await response.json();
  return data.posts || [];
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
