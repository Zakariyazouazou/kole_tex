'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-XXXXX';

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('successTitle')}</h1>
          <p className="mt-3 text-gray-500 text-sm leading-relaxed">
            {t('successMessage')}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-6 py-3">
            <Package className="h-5 w-5 text-brand-blue" />
            <span className="text-sm text-gray-500">{t('orderNumber')}:</span>
            <span className="font-mono font-semibold text-gray-900">{orderId}</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue-light cursor-pointer"
              >
                {t('continueShopping')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-brand-blue hover:bg-brand-blue-dark cursor-pointer">
                {t('viewOrders')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
