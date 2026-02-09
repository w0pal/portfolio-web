import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { authOptions } from '../../lib/auth';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET: Fetch all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Create a new blog post (Admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { title, description, content, coverImage, source, originalLink, slug } = json;

    const finalSlug = slug || generateSlug(title);

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
       return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        description,
        content,
        coverImage,
        source, // "LOCAL" or "MEDIUM"
        originalLink,
        slug: finalSlug,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
