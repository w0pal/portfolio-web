import { prisma } from '../../../lib/prisma';
import PortfolioForm from '../../components/PortfolioForm';
import { notFound } from 'next/navigation';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.portfolioItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  // Convert tags format if needed, but the form handles it.
  // We pass the raw item from Prisma which has tags as String (JSON string likely).
  
  return <PortfolioForm initialData={item} isEdit />;
}
