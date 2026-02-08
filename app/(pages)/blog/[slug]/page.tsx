import { getPostBySlug } from '../../../lib/medium';
import BlogDetailContent from './BlogDetailContent';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
 params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
 const { slug } = await params;
 const mediumUsername = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || '';
 const post = await getPostBySlug(mediumUsername, slug);

 if (!post) {
  notFound();
 }

 return <BlogDetailContent post={post} />;
}
