import { ProductDetailPage } from '@/features/products/ProductDetailPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return { title: `Product ${id} — Kole Tex` };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailPage catalogReference={id} />;
}

