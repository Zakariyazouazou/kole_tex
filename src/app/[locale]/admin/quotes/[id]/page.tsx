import { QuoteAdminDetailClient } from './QuoteAdminDetailClient';

export const metadata = { title: 'Admin — Quote Detail' };

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuoteAdminDetailClient id={id} />;
}
