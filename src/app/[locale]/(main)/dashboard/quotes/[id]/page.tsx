import { QuoteDetailClient } from './QuoteDetailClient';

export const metadata = { title: 'Quote Request Details' };

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuoteDetailClient id={id} />;
}
