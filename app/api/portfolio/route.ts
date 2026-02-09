import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { authOptions } from '../../lib/auth';

// GET: Fetch all portfolio items
export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST: Create a new portfolio item (Admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { title, description, link, imageUrl, tags } = json;

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        link,
        imageUrl,
        tags: JSON.stringify(tags), // Ensure tags are stored as JSON stirng
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
