'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function WishlistClient() {
  const t = useTranslations('wishlist');
  
  // Static data for demonstration
  const wishlistItems = products.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-brand-blue-light rounded-full flex items-center justify-center text-brand-blue">
              <Heart className="h-8 w-8 fill-current" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h1>
            <p className="max-w-xl text-gray-500">{t('emptyMessage')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium mb-6">{t('empty')}</p>
              <Link href="/products">
                <Button className="cursor-pointer">
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
