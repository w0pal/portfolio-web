import { prisma } from '../../../lib/prisma';
import { fetchMediumPosts } from '../../../lib/medium';
import BlogDetailContent from './BlogDetailContent';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try DB first
  const dbPost = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImage: true },
  });

  if (dbPost) {
    return {
      title: `${dbPost.title} | w0pal's Blog`,
      description: dbPost.description || dbPost.title,
      openGraph: {
        title: dbPost.title,
        description: dbPost.description || undefined,
        images: dbPost.coverImage ? [dbPost.coverImage] : [],
      },
    };
  }

  // Try Medium
  const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';
  const mediumPosts = await fetchMediumPosts(mediumUsername);
  const mediumPost = mediumPosts.find((post) => post.slug === slug);

  if (mediumPost) {
    return {
      title: `${mediumPost.title} | w0pal's Blog`,
      description: mediumPost.description,
      openGraph: {
        title: mediumPost.title,
        description: mediumPost.description,
        images: mediumPost.thumbnail ? [mediumPost.thumbnail] : [],
      },
    };
  }

  return {
    title: 'Blog Post Not Found | w0pal',
  };
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
