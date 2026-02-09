import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';

// GET: Fetch single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT: Update blog post (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const json = await request.json();
    const { title, description, content, coverImage, source, originalLink, slug: newSlug } = json;

    // TODO: if newSlug is different, check uniqueness.
    // For now, assuming basic update.

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        description,
        content,
        coverImage,
        source,
        originalLink,
        slug: newSlug || slug, // Allow slug update if provided
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE: Delete blog post (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
