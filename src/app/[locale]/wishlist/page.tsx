import { getTranslations } from 'next-intl/server';
import { WishlistClient } from './WishlistClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.wishlist' });
  return { title: t('title'), description: t('description') };
}

export default function WishlistPage() {
  return <WishlistClient />;
}
