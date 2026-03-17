import { getTranslations } from 'next-intl/server';
import { HomeClient } from './HomeClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePage() {
  return <HomeClient />;
}
