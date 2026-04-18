'use client';

import { useState, useEffect, useCallback } from 'react';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { QuoteRequest, QuoteStatus } from '@/types/quote.types';
import { Link } from '@/i18n/navigation';
import { AlertCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: QuoteStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_COLORS: Record<QuoteStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-orange-100 text-orange-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const fmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

// ─── Component ────────────────────────────────────────────────────────────────

export function QuotesClient() {
  const [activeTab, setActiveTab] = useState<QuoteStatus | 'ALL'>('ALL');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(() => {
    setLoading(true);
    setError(null);
    protectedApi
      .getMyQuotes({
        ...(activeTab !== 'ALL' ? { status: activeTab } : {}),
        page,
        limit: 10,
      })
      .then((res) => {
        setQuotes(res.data);
        setMeta(res.meta);
      })
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleTabChange = (tab: QuoteStatus | 'ALL') => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">My Quote Requests</h1>
        <p className="text-sm text-gray-500">Track and manage your quote requests</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab.value
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/20'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && quotes.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-white">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">No quote requests yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            Browse our products and request a quote to get started.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Quote cards */}
      {!loading && !error && quotes.length > 0 && (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-brand-blue">
                      #{quote.id.slice(-8).toUpperCase()}
                    </span>
                    <Badge
                      className={`${STATUS_COLORS[quote.status]} border-0 capitalize px-3 py-1 rounded-full text-[11px] font-bold`}
                    >
                      {quote.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">{quote.items.length}</span>{' '}
                    {quote.items.length === 1 ? 'item' : 'items'}
                    {' · '}
                    <span className="font-semibold text-gray-900">{fmt.format(quote.totalPrice)}</span>
                  </p>
                </div>
                <Link
                  href={`/dashboard/quotes/${quote.id}`}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-all"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
