'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { QuoteRequest, QuoteStatus } from '@/types/quote.types';
import { Link } from '@/i18n/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Info,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Status config ────────────────────────────────────────────────────────────

const ALL_STATUSES: QuoteStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
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

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        type === 'success'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message}
    </div>
  );
}

// ─── Mark as Paid button ──────────────────────────────────────────────────────

function MarkAsPaidButton({
  quoteId,
  onPaid,
}: {
  quoteId: string;
  onPaid: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      await adminApi.markQuoteAsPaid(quoteId);
      showToast('Quote marked as paid', 'success');
      onPaid();
    } catch (err) {
      showToast(extractApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        Mark as Paid
      </button>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

// ─── Update status panel ──────────────────────────────────────────────────────

function UpdateStatusPanel({
  quoteId,
  currentStatus,
  onUpdated,
}: {
  quoteId: string;
  currentStatus: QuoteStatus;
  onUpdated: (status: QuoteStatus) => void;
}) {
  const [selected, setSelected] = useState<QuoteStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateAdminQuoteStatus(quoteId, selected);
      onUpdated(updated.status);
      showToast(`Status updated to ${updated.status}`, 'success');
    } catch (err) {
      const msg = extractApiError(err);
      showToast(msg.includes('not found') ? 'Quote not found.' : msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Update Status</h2>

      <p className="text-xs text-gray-500 flex items-start gap-1.5">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-500" />
        Saving this status will notify the customer by email.
      </p>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as QuoteStatus)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-800/30"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || selected === currentStatus}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Status
      </button>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// ─── Admin note panel ─────────────────────────────────────────────────────────

function AdminNotePanel({
  quoteId,
  initialNote,
}: {
  quoteId: string;
  initialNote: string;
}) {
  const [noteText, setNoteText] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateAdminQuoteNote(quoteId, noteText);
      showToast('Note saved', 'success');
    } catch (err) {
      showToast(extractApiError(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Internal Note</h2>
      <p className="text-xs text-gray-500">
        This note will be visible to the customer on their quote detail page.
      </p>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={4}
        placeholder="Leave an internal note for this quote…"
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-800/30 resize-none"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Note
      </button>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface QuoteAdminDetailClientProps {
  id: string;
}

export function QuoteAdminDetailClient({ id }: QuoteAdminDetailClientProps) {
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminApi
      .getAdminQuoteById(id)
      .then(setQuote)
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  // Compute totals from items in case backend doesn't return them
  const computedTotal = quote
    ? quote.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    : 0;
  const displayTotal = quote?.totalPrice ?? computedTotal;

  const getLineTotal = (item: QuoteRequest['items'][number]) =>
    item.lineTotal ?? item.unitPrice * item.quantity;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-800" />
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
          href="/admin/quotes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Quotes
      </Link>

      {/* Quote header */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Quote ID</p>
            <p className="font-mono text-sm text-gray-700 mt-0.5 break-all">{quote.id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start">
            <Badge className={`${STATUS_COLORS[quote.status]} border-0 px-4 py-1.5 rounded-full text-xs font-bold`}>
              {quote.status}
            </Badge>
            {quote.isPaid ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-4 py-1.5 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Paid
              </span>
            ) : (
              <MarkAsPaidButton
                quoteId={quote.id}
                onPaid={() => setQuote((prev) => prev ? { ...prev, isPaid: true } : prev)}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium">Customer</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : '—'}
            </p>
            {quote.user?.email && (
              <p className="text-xs text-gray-500">{quote.user.email}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Submitted</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {new Date(quote.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt.format(displayTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Items</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{quote.items.length}</p>
          </div>
        </div>
      </div>

      {/* Two-column: admin actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpdateStatusPanel
          quoteId={quote.id}
          currentStatus={quote.status}
          onUpdated={(status) => setQuote((prev) => prev ? { ...prev, status } : prev)}
        />
        <AdminNotePanel quoteId={quote.id} initialNote={quote.adminNote ?? ''} />
      </div>

      {/* Delivery address */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Delivery Address</h2>
        {quote.address ? (
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-semibold text-gray-900">{quote.address.fullName}</p>
            <p>{quote.address.addressLine1}</p>
            {quote.address.addressLine2 && <p>{quote.address.addressLine2}</p>}
            <p>{quote.address.city}, {quote.address.postalCode}</p>
            <p>{quote.address.country}</p>
            <p className="text-gray-500">{quote.address.phoneNumber}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Not available</p>
        )}
      </div>

      {/* Items table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Items</h2>
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
                  <td className="px-5 py-3 text-right font-bold text-gray-900">{fmt.format(getLineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={5} className="px-5 py-3 text-right text-sm font-bold text-gray-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-slate-800 text-base">
                  {fmt.format(displayTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* User note */}
      {quote.note && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Customer Note</h2>
          <p className="text-sm text-gray-700">{quote.note}</p>
        </div>
      )}
    </div>
  );
}
