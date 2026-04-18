'use client';

import { useTranslations } from 'next-intl';

export function CheckoutClient() {
  const t = useTranslations('checkout');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-500 text-base">{t('comingSoon')}</p>
      </div>
    </div>
  );
}
