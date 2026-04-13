'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { SlidersHorizontal, Search, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from './hooks/useProducts';
import type { ProductFilters } from './hooks/useProducts';
import { FiltersSidebar } from './components/FiltersSidebar';
import { ApiProductCard } from './components/ApiProductCard';
import { useState } from 'react';

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              p === page
                ? 'border-brand-blue bg-brand-blue text-white font-semibold'
                : 'border-gray-200 text-gray-700 hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-4/5 rounded-2xl bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ProductListPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gridRef = useRef<HTMLDivElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Rehydrate filters from URL on mount ───────────────────────────────────
  const getInitialFilters = (): ProductFilters => ({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 24,
    sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || undefined,
    categorySlug: searchParams.get('categorySlug') || undefined,
    subCategorySlug: searchParams.get('subCategorySlug') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    organic: searchParams.get('organic') === 'true' ? true : undefined,
    recycled: searchParams.get('recycled') === 'true' ? true : undefined,
    colors: searchParams.getAll('colors').length ? searchParams.getAll('colors') : undefined,
    sizes: searchParams.getAll('sizes').length ? searchParams.getAll('sizes') : undefined,
    brands: searchParams.getAll('brands').length ? searchParams.getAll('brands') : undefined,
  });

  const {
    products,
    pagination,
    availableFilters,
    isLoading,
    error,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  } = useProducts(getInitialFilters());

  // ── Sync filters → URL ────────────────────────────────────────────────────
  const syncToUrl = useCallback(
    (f: ProductFilters) => {
      const params = new URLSearchParams();
      if (f.page && f.page > 1) params.set('page', String(f.page));
      if (f.limit && f.limit !== 24) params.set('limit', String(f.limit));
      if (f.sortBy) params.set('sortBy', f.sortBy);
      if (f.categorySlug) params.set('categorySlug', f.categorySlug);
      if (f.subCategorySlug) params.set('subCategorySlug', f.subCategorySlug);
      if (f.minPrice !== undefined) params.set('minPrice', String(f.minPrice));
      if (f.maxPrice !== undefined) params.set('maxPrice', String(f.maxPrice));
      if (f.organic) params.set('organic', 'true');
      if (f.recycled) params.set('recycled', 'true');
      f.colors?.forEach((c) => params.append('colors', c));
      f.sizes?.forEach((s) => params.append('sizes', s));
      f.brands?.forEach((b) => params.append('brands', b));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const handleFiltersChange = (next: ProductFilters) => {
    setFilters(next);
    syncToUrl(next);
  };

  const handlePageChange = (p: number) => {
    const next = { ...filters, page: p };
    handleFiltersChange(next);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isSearchMode = searchQuery.length >= 2;
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 0;
  const total = pagination?.total ?? 0;
  const limit = filters.limit ?? 24;
  const showing = {
    from: total === 0 ? 0 : (page - 1) * limit + 1,
    to: Math.min(page * limit, total),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-screen-2xl px-4 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore our full catalog of sustainable textiles.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Filters sidebar */}
          <FiltersSidebar
            availableFilters={availableFilters}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isMobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm mb-5 flex flex-wrap items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-40">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products… (min 2 chars)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={filters.sortBy ?? ''}
                onChange={(e) =>
                  handleFiltersChange({
                    ...filters,
                    sortBy: (e.target.value as ProductFilters['sortBy']) || undefined,
                    page: 1,
                  })
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-blue focus:outline-none cursor-pointer"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              {/* Limit */}
              <select
                value={filters.limit ?? 24}
                onChange={(e) =>
                  handleFiltersChange({ ...filters, limit: Number(e.target.value), page: 1 })
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-blue focus:outline-none cursor-pointer"
              >
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
                <option value={48}>48 / page</option>
              </select>
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-500 mb-4">
              {isLoading
                ? 'Loading…'
                : total > 0
                ? `Showing ${showing.from}–${showing.to} of ${total} products`
                : ''}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Grid */}
            <div ref={gridRef}>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: limit > 12 ? 12 : limit }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 border border-dashed border-gray-200 rounded-2xl text-center">
                  <p className="text-gray-500 text-base font-medium">No products found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your filters or search query.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleFiltersChange({
                        page: 1,
                        limit: filters.limit,
                        categorySlug: filters.categorySlug,
                      })
                    }
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ApiProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
