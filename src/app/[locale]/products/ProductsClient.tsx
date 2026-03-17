'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { products } from '@/lib/products';
import { getCategories } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

export function ProductsClient() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const allCategories = getCategories();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read filters from URL
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const ratingFilter = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const sortBy = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';

  // Update URL params
  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/${locale}/products?${params.toString()}`);
  };

  const toggleCategory = (cat: string) => {
    const current = [...selectedCategories];
    const idx = current.indexOf(cat);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(cat);
    }
    updateParams({ category: current.length > 0 ? current.join(',') : undefined });
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (minPrice !== undefined) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      result = result.filter((p) => p.price <= maxPrice);
    }
    if (ratingFilter !== undefined) {
      result = result.filter((p) => p.rating >= ratingFilter);
    }

    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategories, minPrice, maxPrice, ratingFilter, sortBy, searchQuery]);

  const clearFilters = () => {
    router.push(`/${locale}/products`);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('category')}</h3>
        <div className="space-y-2">
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('priceRange')}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t('minPrice')}
            value={minPrice ?? ''}
            onChange={(e) =>
              updateParams({ minPrice: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder={t('maxPrice')}
            value={maxPrice ?? ''}
            onChange={(e) =>
              updateParams({ maxPrice: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('rating')}</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                updateParams({
                  rating: ratingFilter === stars ? undefined : String(stars),
                })
              }
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                ratingFilter === stars
                  ? 'bg-brand-blue-light text-brand-blue'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span>
                {stars} {t('starsAndUp')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full text-sm cursor-pointer"
      >
        {t('clearFilters')}
      </Button>
    </div>
  );

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-blue-light via-white to-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-500">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-8">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-36 rounded-xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">{t('filters')}</h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  {t('showing')} <strong>{filtered.length}</strong> {t('of')}{' '}
                  <strong>{products.length}</strong> {t('results')}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="lg:hidden flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {t('filters')}
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="newest">{t('newest')}</option>
                    <option value="priceLow">{t('priceLow')}</option>
                    <option value="priceHigh">{t('priceHigh')}</option>
                    <option value="rating">{t('ratingSort')}</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 font-medium">{t('noProducts')}</p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4 cursor-pointer"
                  >
                    {t('clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{t('filters')}</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </>
      )}
    </div>
  );
}
