import { getTranslations } from 'next-intl/server';
import { SettingsClient } from './SettingsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.dashboard' });
  return { title: `${t('title')} | Settings` };
}

export default function SettingsPage() {
  return <SettingsClient />;
}
