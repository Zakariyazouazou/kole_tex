'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Heart } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import type { ProductListItem } from '@/types/product.types';

interface ApiProductCardProps {
  product: ProductListItem;
}

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

const PLACEHOLDER = '/placeholder-product.png';
const MAX_SWATCHES = 5;

export function ApiProductCard({ product }: ApiProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError || !product.mainImage ? PLACEHOLDER : product.mainImage;
  const hasExtraColors = product.colorsCount > MAX_SWATCHES;
  const visibleColors = product.colors.slice(0, MAX_SWATCHES);

  // Old price = minPrice + 20% (simulated pre-discount price)
  const oldPrice = product.minPrice !== null ? product.minPrice * 1.2 : null;

  return (
    <Link
      href={`/products/${product.catalogReference}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-visible">
        {/* Image Container */}
        <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-[#F3F4F6]">
          {/* Main image */}
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImgError(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              hovered ? 'opacity-90' : 'opacity-100'
            }`}
          />

          {/* Badges top-left */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.organic && (
              <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                Organic
              </span>
            )}
            {product.recycled && (
              <span className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                Recycled
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-4 right-4 h-8 w-8 md:h-10 md:w-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 shadow-sm hover:bg-white hover:text-red-500 transition-all cursor-pointer z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Hover overlay CTA */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] transition-all duration-500 ease-out transform ${
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <CustomButton
              className="w-full bg-white text-gray-900 border-none py-1.5 md:py-2.5 rounded-full font-bold shadow-xl hover:bg-gray-50 text-[9px] md:text-xs"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              View product
            </CustomButton>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3 md:mt-4 space-y-0.5 md:space-y-1">
          <p className="text-[9px] md:text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {product.brand}
          </p>
          <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 md:gap-2 pt-0.5">
            <span className="text-sm md:text-base font-bold text-gray-900">
              {product.minPrice !== null ? priceFormatter.format(product.minPrice) : '—'}
            </span>
            {oldPrice !== null && product.minPrice !== null && (
              <span className="text-[11px] md:text-sm text-gray-400 line-through">
                {priceFormatter.format(oldPrice)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 md:mt-3">
              {visibleColors.map((c) => (
                <span
                  key={c.colorId}
                  title={c.colorName}
                  className="h-3.5 w-3.5 md:h-5 md:w-5 rounded-[3px] md:rounded-[4px] border border-gray-200 shadow-xs"
                  style={{ backgroundColor: c.hexColor || '#999' }}
                />
              ))}
              {hasExtraColors && (
                <span className="text-[10px] text-gray-500 font-medium">
                  +{product.colorsCount - MAX_SWATCHES}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
