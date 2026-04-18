'use client';

import { useState, useEffect } from 'react';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { QuoteRequest, QuoteStatus } from '@/types/quote.types';
import { Link } from '@/i18n/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Info,
  Loader2,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Status config ────────────────────────────────────────────────────────────

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

// ─── Cancel modal ─────────────────────────────────────────────────────────────

function CancelInfoModal({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Cancel Your Quote Request</h2>
        <p className="text-sm text-gray-600">
          To cancel this quote, please contact us directly and include your Quote ID.
        </p>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <p className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="h-4 w-4 text-brand-blue shrink-0" />
            <a href="mailto:info@kottex.be" className="font-semibold text-brand-blue hover:underline">
              info@kottex.be
            </a>
          </p>
          <p className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-brand-blue shrink-0" />
            <a href="tel:+3221234567" className="font-semibold text-brand-blue hover:underline">
              +32 (0)2 123 45 67
            </a>
          </p>
        </div>

        <div className="rounded-lg bg-brand-blue/5 border border-brand-blue/20 px-4 py-3">
          <p className="text-xs text-gray-600">
            Please include your Quote ID in your message:
          </p>
          <p className="font-mono font-bold text-brand-blue text-sm mt-1">
            {quoteId.slice(-8).toUpperCase()}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface QuoteDetailClientProps {
  id: string;
}

export function QuoteDetailClient({ id }: QuoteDetailClientProps) {
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    protectedApi
      .getMyQuoteById(id)
      .then(setQuote)
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error ?? 'Quote not found.'}
        </div>
        <Link
          href="/dashboard/quotes"
          className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Quotes
        </Link>
      </div>
    );
  }

  const canCancel = quote.status === 'PENDING' || quote.status === 'CONFIRMED';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-blue transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Quotes
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Quote ID</p>
            <p className="font-mono font-bold text-brand-blue text-lg mt-0.5">
              #{quote.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Badge className={`${STATUS_COLORS[quote.status]} border-0 px-4 py-1.5 rounded-full text-xs font-bold self-start`}>
            {quote.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium">Submitted</p>
            <p className="text-sm text-gray-700 font-semibold mt-0.5">
              {new Date(quote.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt.format(quote.totalPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Items</p>
            <p className="text-sm text-gray-700 font-semibold mt-0.5">{quote.items.length}</p>
          </div>
        </div>

        {canCancel && (
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Cancel my request
            </button>
          </div>
        )}
      </div>

      {/* Admin note */}
      {quote.adminNote && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              Note from our team
            </p>
            <p className="text-sm text-blue-900">{quote.adminNote}</p>
          </div>
        </div>
      )}

      {/* Delivery address */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Delivery Address</h2>
        {quote.address ? (
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-semibold text-gray-900">{quote.address.fullName}</p>
            <p>{quote.address.addressLine1}</p>
            {quote.address.addressLine2 && <p>{quote.address.addressLine2}</p>}
            <p>
              {quote.address.city}, {quote.address.postalCode}
            </p>
            <p>{quote.address.country}</p>
            <p className="text-gray-500">{quote.address.phoneNumber}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Address not available</p>
        )}
      </div>

      {/* Items table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product / SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit Price</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quote.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900">{item.sku?.product?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku?.sku ?? '—'}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{item.sku?.color?.colorName ?? '—'}</td>
                  <td className="px-5 py-3 text-gray-700">{item.sku?.sizeLabel ?? '—'}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">{item.quantity}</td>
                  <td className="px-5 py-3 text-right text-gray-700">{fmt.format(item.unitPrice)}</td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">{fmt.format(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={5} className="px-5 py-3 text-right text-sm font-bold text-gray-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-brand-blue text-base">
                  {fmt.format(quote.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* User note */}
      {quote.note && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Your Note</h2>
          <p className="text-sm text-gray-700">{quote.note}</p>
        </div>
      )}

      {/* Cancel modal */}
      {showCancelModal && (
        <CancelInfoModal quoteId={quote.id} onClose={() => setShowCancelModal(false)} />
      )}
    </div>
  );
}
