'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/products';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedProducts() {
  const t = useTranslations('home');
  const featured = getFeaturedProducts();

  return (
    <section className="py-7 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t('featuredProducts')}</h2>
          <p className="mt-2 text-gray-500">{t('featuredSubtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue-light rounded-full px-8 cursor-pointer"
            >
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
