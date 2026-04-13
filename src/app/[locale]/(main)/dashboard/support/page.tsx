import { getTranslations } from 'next-intl/server';
import { SupportClient } from './SupportClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.dashboard' });
  return { title: `${t('title')} | Support` };
}

export default function SupportPage() {
  return <SupportClient />;
}
