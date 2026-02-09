import { prisma } from '../../lib/prisma';
import PortfolioClient from './PortfolioClient';

export const revalidate = 60; // Cache for 60 seconds

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <PortfolioClient items={items} />;
}
