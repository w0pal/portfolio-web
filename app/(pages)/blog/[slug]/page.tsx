import { prisma } from '../../../lib/prisma';
import { fetchMediumPosts } from '../../../lib/medium';
import BlogDetailContent from './BlogDetailContent';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  
  // First, try to find the post in the database
  const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
  });

  if (dbPost) {
    return <BlogDetailContent post={dbPost} />;
  }

  // If not found in database, try to find in Medium RSS
  const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';
  const mediumPosts = await fetchMediumPosts(mediumUsername);
  const mediumPost = mediumPosts.find((post) => post.slug === slug);

  if (mediumPost) {
    // Convert Medium post to the expected format
    const post = {
      id: `medium-${mediumPost.slug}`,
      title: mediumPost.title,
      slug: mediumPost.slug,
      description: mediumPost.description,
      content: mediumPost.fullContent,
      coverImage: mediumPost.thumbnail || null,
      source: 'MEDIUM' as const,
      originalLink: mediumPost.link,
      createdAt: new Date(mediumPost.pubDate),
      categories: mediumPost.categories,
      author: mediumPost.author,
    };
    return <BlogDetailContent post={post} />;
  }

  // Not found anywhere
  notFound();
}
