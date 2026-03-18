'use client';

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Star } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import type { Product } from '@/lib/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const t = useTranslations('products');
  const [hovered, setHovered] = useState(false);

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

  const secondaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-visible">
        {/* Image Container */}
        <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-[#F3F4F6]">
          {/* Base Image */}
          <img
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Hover Image */}
          <img
            src={secondaryImage}
            alt={`${product.name} hover`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
                product.badge === 'New' ? 'bg-[#4B6B92]' : 'bg-brand-blue'
              }`}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* "Choose Options" Overlay Button */}
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] transition-all duration-500 ease-out transform ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <CustomButton
              className="w-full bg-white text-gray-900 border-none py-2.5 md:py-4 rounded-full font-bold shadow-xl hover:bg-gray-50 text-[10px] md:text-sm"
              onClick={handleAddToCart}
            >
              Choose Options
            </CustomButton>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3 md:mt-4 space-y-0.5 md:space-y-1">
          <p className="text-[9px] md:text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {product.subcategory || product.category}
          </p>
          <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1.5 md:gap-2 pt-0.5">
            <span className="text-sm md:text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] md:text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 md:mt-3">
              {product.variants.colors.map((color) => {
                const colorMap: Record<string, string> = {
                  'Black': '#000000',
                  'White': '#FFFFFF',
                  'Navy': '#2d3a7a',
                  'Sage Green': '#8DA399',
                  'Charcoal': '#36454F',
                  'Camel': '#C19A6B',
                  'Burgundy': '#800020',
                  'Silver': '#C0C0C0',
                  'Space Gray': '#53565A',
                  'Natural': '#E5D3B3',
                  'Walnut': '#773F1A',
                  'Midnight Blue': '#191970',
                  'Forest Green': '#228B22',
                  'Sunrise Pink': '#FFDBE9',
                  'Matte Black': '#28282B',
                  'Arctic White': '#F0F8FF',
                  'Ocean Blue': '#0077BE',
                  'Rose Gold': '#B76E79',
                  'Dusty Rose': '#BA8B8B',
                  'Olive': '#808000',
                  'Teal': '#008080',
                  'Gray': '#808080',
                  'Cream': '#FFFDD0',
                  'Terracotta': '#E2725B',
                  'Sage': '#BCB88A',
                  'Dusty Blue': '#8BA2B0',
                  'Red': '#FF0000',
                };
                return (
                  <div
                    key={color}
                    className="h-3.5 w-3.5 md:h-5 md:w-5 rounded-[3px] md:rounded-[4px] border border-gray-200 shadow-xs"
                    style={{ backgroundColor: colorMap[color] || color.toLowerCase() }}
                    title={color}
                  />
                );
              })}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 md:gap-1.5 pt-1.5 md:pt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 md:h-3 md:w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-gray-900 text-gray-900'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {product.inStock ? t('inStock') : t('outOfStock')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
