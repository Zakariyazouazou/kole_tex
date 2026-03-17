'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/products';
import { Star, Minus, Plus, Check, Truck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomButton } from '@/components/ui/CustomButton';


interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const t = useTranslations('product');
  const { addToCart } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.variants.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const allImages = [product.image, ...product.images];

  const handleAddToCart = () => {
    const variant = [selectedSize, selectedColor].filter(Boolean).join(' / ') || undefined;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      variant,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === i
                      ? 'border-brand-blue shadow-sm'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span className="inline-block rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount} {t('reviews').toLowerCase()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-brand-blue">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <p
              className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${
                product.inStock ? 'text-green-600' : 'text-red-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              {product.inStock
                ? t('addToCart') === t('addToCart')
                  ? 'In Stock'
                  : ''
                : 'Out of Stock'}
            </p>

            {/* Variants */}
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('color')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'border-brand-blue bg-brand-blue-light text-brand-blue font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-brand-blue bg-brand-blue-light text-brand-blue font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-gray-500 hover:text-brand-blue transition-colors cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2.5 text-sm font-medium border-x border-gray-200 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-gray-500 hover:text-brand-blue transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <CustomButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-6 text-base rounded-lg border-none ${
                  added
                    ? 'bg-green-600'
                    : 'bg-brand-blue'
                }`}
                bgHover={added ? '#15803d' : '#2d3a7a'}
                textHover="white"
              >
                {added ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    {t('addedToCart')}
                  </span>
                ) : (
                  t('addToCart')
                )}
              </CustomButton>

            </div>

            {/* Delivery Info */}
            <div className="mt-6 space-y-2">
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Truck className="h-4 w-4 text-brand-blue" />
                {t('deliveryInfo')}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <RotateCcw className="h-4 w-4 text-brand-blue" />
                {t('returnPolicy')}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent rounded-none h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue data-[state=active]:shadow-none px-6 py-3 cursor-pointer"
              >
                {t('description')}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue data-[state=active]:shadow-none px-6 py-3 cursor-pointer"
              >
                {t('specifications')}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue data-[state=active]:shadow-none px-6 py-3 cursor-pointer"
              >
                {t('reviews')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="max-w-2xl">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-gray-500">{key}</span>
                    <span className="text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <p className="text-gray-500 text-sm">
                {product.reviewCount} reviews — {product.rating}/5 average rating
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
