'use client';

import { useApp } from '@/context/AppContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  const t = useTranslations('products');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-blue/20 hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-brand-blue px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {/* Discount */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-gray-700 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-blue hover:text-white cursor-pointer"
            aria-label={t('addToCart')}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-brand-blue">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-xs mt-2 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
            {product.inStock ? t('inStock') : t('outOfStock')}
          </p>
        </div>
      </div>
    </Link>
  );
}
