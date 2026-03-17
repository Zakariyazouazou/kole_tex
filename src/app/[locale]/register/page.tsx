import { getTranslations } from 'next-intl/server';
import { RegisterClient } from './RegisterClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.register' });
  return { title: t('title'), description: t('description') };
}

export default function RegisterPage() {
  return <RegisterClient />;
}
