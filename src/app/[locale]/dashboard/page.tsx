import { getTranslations } from 'next-intl/server';
import { DashboardClient } from './DashboardClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.dashboard' });
  return { title: t('title'), description: t('description') };
}

export default function DashboardPage() {
  return <DashboardClient />;
}
