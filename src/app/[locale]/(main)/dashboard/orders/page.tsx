import { getTranslations } from 'next-intl/server';
import { OrdersClient } from './OrdersClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.dashboard' });
  return { title: `${t('title')} | Orders` };
}

export default function OrdersPage() {
  return <OrdersClient />;
}
