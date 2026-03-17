import { getTranslations } from 'next-intl/server';
import { ProductsClient } from './ProductsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.products' });
  return { title: t('title'), description: t('description') };
}

export default function ProductsPage() {
  return <ProductsClient />;

}
