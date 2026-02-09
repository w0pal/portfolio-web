import { prisma } from '../../../lib/prisma';
import BlogPostForm from '../../components/BlogPostForm';
import { notFound } from 'next/navigation';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  return <BlogPostForm initialData={post} isEdit />;
}
