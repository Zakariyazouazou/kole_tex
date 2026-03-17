import { getTranslations } from 'next-intl/server';
import { CartClient } from './CartClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.cart' });
  return { title: t('title'), description: t('description') };
}

export default function CartPage() {
  return <CartClient />;
}
