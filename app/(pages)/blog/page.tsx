import { prisma } from '../../lib/prisma';
import { fetchMediumPosts } from '../../lib/medium';
import BlogContent from './BlogContent';

export const revalidate = 60; // Cache for 60 seconds

export default async function BlogPage() {
  const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';

  // Fetch local and medium posts in parallel
  const [localPosts, mediumPosts] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    fetchMediumPosts(mediumUsername),
  ]);

  // Convert Medium posts to the same format as database posts
  const mediumPostsFormatted = mediumPosts.map((post) => ({
    id: `medium-${post.slug}`,
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.fullContent,
    coverImage: post.thumbnail || null,
    source: 'MEDIUM' as const,
    originalLink: post.link,
    published: true,
    createdAt: new Date(post.pubDate),
    updatedAt: new Date(post.pubDate),
  }));

  // Combine and sort by date
  const allPosts = [...localPosts, ...mediumPostsFormatted].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <BlogContent posts={allPosts} />;
}
