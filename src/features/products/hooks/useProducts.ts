'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { publicApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type {
  GetProductsParams,
  ProductListItem,
  ProductListResponse,
  ProductFiltersResponse,
} from '@/types/product.types';

export type ProductFilters = Omit<GetProductsParams, 'lang'>;

interface UseProductsResult {
  products: ProductListItem[];
  pagination: ProductListResponse['pagination'] | null;
  availableFilters: ProductFiltersResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refetch: () => void;
}

const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 24, totalPages: 0 };

export function useProducts(initialFilters: ProductFilters = {}): UseProductsResult {
  const locale = useLocale();
  // next-intl locale maps 1-to-1 with the supported API lang values
  const lang = locale as 'en' | 'fr' | 'de';

  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [pagination, setPagination] = useState<ProductListResponse['pagination']>(DEFAULT_PAGINATION);
  const [availableFilters, setAvailableFilters] = useState<ProductFiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query — only activate after 400 ms
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedQuery(q);
    }, 400);
  }, []);

  const setFilters = useCallback((next: ProductFilters) => {
    // Reset page to 1 whenever any filter changes (except explicit page change)
    setFiltersState(next);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const isSearchMode = debouncedQuery.length >= 2;

    try {
      if (isSearchMode) {
        const [productsResult] = await Promise.all([
          publicApi.searchProducts({
            lang,
            q: debouncedQuery,
            page: filters.page,
            limit: filters.limit,
          }),
        ]);
        setProducts(productsResult.data);
        setPagination(productsResult.pagination);
      } else {
        const [productsResult, filtersResult] = await Promise.all([
          publicApi.getProducts({ lang, ...filters }),
          publicApi.getProductFilters({ lang, ...filters }),
        ]);
        setProducts(productsResult.data);
        setPagination(productsResult.pagination);
        setAvailableFilters(filtersResult);
      }
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [lang, filters, debouncedQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    pagination,
    availableFilters,
    isLoading,
    error,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    refetch: fetchData,
  };
}
