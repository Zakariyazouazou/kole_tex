'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { ProductDetail, ProductSku, ProductColor } from '@/types/product.types';
import type { Address } from '@/types/address.types';
import type { CreateQuotePayload } from '@/types/quote.types';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  X,
} from 'lucide-react';

// ─── Price formatter ──────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

// ─── Size sort order ──────────────────────────────────────────────────────────

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE SIZE'];

function sortSkus(skus: ProductSku[]): ProductSku[] {
  return [...skus].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.sizeLabel.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.sizeLabel.toUpperCase());
    if (ai === -1 && bi === -1) return a.sizeLabel.localeCompare(b.sizeLabel);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

// ─── Quantity input ───────────────────────────────────────────────────────────

function QtyInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const dec = () => onChange(Math.max(0, value - 1));
  const inc = () => onChange(value + 1);
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || value === 0}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
      >
        <Minus className="h-3 w-3" />
      </button>
      <input
        type="number"
        min={0}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(isNaN(v) || v < 0 ? 0 : v);
        }}
        className="w-14 rounded-md border border-gray-200 bg-white py-1 text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

// ─── Address form (create or update) ─────────────────────────────────────────

interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

const EMPTY_FORM: AddressFormData = {
  fullName: '',
  phoneNumber: '',
  addressLine1: '',
  city: '',
  postalCode: '',
  country: '',
  state: '',
};

interface AddressFormProps {
  initial?: Partial<AddressFormData> & { id?: string };
  mode: 'create' | 'edit';
  onSaved: () => void;
  phoneError?: string;
}

function AddressForm({ initial, mode, onSaved, phoneError }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    ...EMPTY_FORM,
    ...(initial ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof AddressFormData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        addressLine1: form.addressLine1,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        ...(form.state ? { state: form.state } : {}),
      };
      if (mode === 'edit' && initial?.id) {
        await protectedApi.updateAddress(initial.id, payload);
      } else {
        await protectedApi.createAddress(payload);
      }
      onSaved();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof AddressFormData, required = true, extraError?: string) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        required={required}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue ${
          extraError ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      />
      {extraError && <p className="mt-1 text-xs text-red-600">{extraError}</p>}
    </div>
  );

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('Full Name', 'fullName')}
        {field('Phone Number', 'phoneNumber', true, phoneError)}
        {field('Street Address', 'addressLine1')}
        {field('City', 'city')}
        {field('Postal Code', 'postalCode')}
        {field('Country', 'country')}
        {field('State / Region', 'state', false)}
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-60 transition-colors"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === 'edit' ? 'Save Changes' : 'Add Address'}
      </button>
    </div>
  );
}

// ─── Address step ─────────────────────────────────────────────────────────────

interface AddressStepProps {
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  phoneError?: string;
}

function AddressStep({ selectedAddressId, onSelect, phoneError }: AddressStepProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAddresses = useCallback(() => {
    setLoading(true);
    setError(null);
    protectedApi
      .getMyAddresses()
      .then((data) => {
        setAddresses(data);
        // Auto-select first address with phone if none selected
        const withPhone = data.filter((a) => a.phoneNumber);
        if (!selectedAddressId && withPhone.length > 0) {
          onSelect(withPhone[0].id);
        }
      })
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [selectedAddressId, onSelect]);

  useEffect(() => {
    fetchAddresses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
      </div>
    );
  }

  const withPhone = addresses.filter((a) => a.phoneNumber);
  const withoutPhone = addresses.filter((a) => !a.phoneNumber);
  const hasAnyAddress = addresses.length > 0;

  return (
    <div className="space-y-4">
      {/* Existing addresses with phone */}
      {withPhone.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Select Delivery Address
          </p>
          {withPhone.map((addr) => {
            const selected = addr.id === selectedAddressId;
            const hasPhoneErr = phoneError && selected;
            return (
              <button
                key={addr.id}
                type="button"
                onClick={() => onSelect(addr.id)}
                className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                  selected
                    ? hasPhoneErr
                      ? 'border-red-400 bg-red-50'
                      : 'border-brand-blue bg-brand-blue/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {addr.addressLine1}, {addr.city} {addr.postalCode}, {addr.country}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{addr.phoneNumber}</p>
                {hasPhoneErr && (
                  <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Addresses missing phone number */}
      {withoutPhone.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {withPhone.length === 0 && !hasAnyAddress
              ? 'Your address is missing a phone number.'
              : 'Some addresses are missing a phone number.'}
          </p>
          {withoutPhone.map((addr) => (
            <div key={addr.id} className="space-y-3">
              <p className="text-xs text-amber-700">
                <strong>{addr.fullName}</strong> — {addr.addressLine1}, {addr.city}
              </p>
              {editingId === addr.id ? (
                <AddressForm
                  initial={{
                    id: addr.id,
                    fullName: addr.fullName,
                    phoneNumber: addr.phoneNumber,
                    addressLine1: addr.addressLine1,
                    city: addr.city,
                    postalCode: addr.postalCode,
                    country: addr.country,
                    state: addr.state,
                  }}
                  mode="edit"
                  onSaved={() => {
                    setEditingId(null);
                    fetchAddresses();
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingId(addr.id)}
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  Add phone number
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No address at all */}
      {!hasAnyAddress && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Please add a delivery address to continue.
          </p>
          <AddressForm mode="create" onSaved={fetchAddresses} />
        </div>
      )}

      {/* Add another address */}
      {hasAnyAddress && !showCreate && (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          + Add another address
        </button>
      )}
      {showCreate && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">New Address</p>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <AddressForm
            mode="create"
            onSaved={() => {
              setShowCreate(false);
              fetchAddresses();
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface QuoteOrderSectionProps {
  product: ProductDetail;
  open: boolean;
  onClose: () => void;
  userEmail?: string;
}

interface VariantRow {
  skuId: string;
  colorName: string;
  colorHex: string | null;
  imageUrl: string | null;
  sizeLabel: string;
  price: number;
  qty: number;
  unavailable?: boolean;
}

export function QuoteOrderSection({
  product,
  open,
  onClose,
  userEmail,
}: QuoteOrderSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Build flat list of all active variants
  const buildRows = useCallback((): VariantRow[] => {
    const rows: VariantRow[] = [];
    for (const color of product.colors) {
      const active = sortSkus(color.skus.filter((s) => !s.isDiscontinued));
      for (const sku of active) {
        rows.push({
          skuId: sku.id,
          colorName: color.colorName,
          colorHex: color.hexColor,
          imageUrl: color.packshots[0]?.urlImage ?? null,
          sizeLabel: sku.sizeLabel,
          price: sku.price,
          qty: 0,
          unavailable: false,
        });
      }
    }
    return rows;
  }, [product]);

  const [rows, setRows] = useState<VariantRow[]>([]);
  const [note, setNote] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Re-init rows whenever product/open changes
  useEffect(() => {
    if (open) {
      setRows(buildRows());
      setNote('');
      setSubmitError(null);
      setRowError(null);
      setPhoneError(undefined);
      setSuccess(false);
    }
  }, [open, buildRows]);

  // Scroll into view when opened
  useEffect(() => {
    if (open && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open]);

  const setQty = (skuId: string, qty: number) => {
    setRows((prev) =>
      prev.map((r) => (r.skuId === skuId ? { ...r, qty } : r))
    );
    setRowError(null);
  };

  const total = rows.reduce((sum, r) => sum + r.price * r.qty, 0);
  const selectedItems = rows.filter((r) => r.qty > 0 && !r.unavailable);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setRowError(null);
    setPhoneError(undefined);

    if (selectedItems.length === 0) {
      setRowError('Please add at least one quantity before requesting a quote.');
      return;
    }
    if (!selectedAddressId) {
      setSubmitError('Please select a delivery address.');
      return;
    }

    setSubmitting(true);
    const payload: CreateQuotePayload = {
      addressId: selectedAddressId,
      items: selectedItems.map((r) => ({ skuId: r.skuId, quantity: r.qty })),
      ...(note.trim() ? { note: note.trim() } : {}),
    };

    try {
      await protectedApi.createQuote(payload);
      setSuccess(true);
    } catch (err) {
      const msg = extractApiError(err);
      if (msg.includes('phone number')) {
        setPhoneError('A phone number is required on your address.');
        setSubmitError(null);
      } else if (msg.includes('Address not found')) {
        setSelectedAddressId(null);
        setSubmitError('Address not found. Please select another.');
      } else if (msg.includes('SKU') && msg.includes('not available')) {
        // Mark unavailable SKUs
        const idMatch = msg.match(/SKU ([a-f0-9-]+)/i);
        if (idMatch) {
          setRows((prev) =>
            prev.map((r) =>
              r.skuId === idMatch[1] ? { ...r, unavailable: true, qty: 0 } : r
            )
          );
        }
        setSubmitError('One or more selected variants are no longer available and have been removed.');
      } else if (msg.includes('At least one item')) {
        setRowError('Please select at least one variant.');
      } else {
        setSubmitError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div ref={sectionRef} className="border-t border-gray-100 bg-gray-50 rounded-2xl mt-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Request a Quote</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Success state */}
      {success ? (
        <div className="px-6 py-10 text-center space-y-3">
          <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
          <p className="text-lg font-bold text-gray-900">Quote request submitted!</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            We will contact you soon.
            {userEmail && (
              <> A confirmation email has been sent to <strong>{userEmail}</strong>.</>
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">

          {/* STEP A — Variant quantity selector */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white text-xs font-bold">1</span>
              Select Quantities
            </h3>

            {rowError && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {rowError}
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit Price</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((row) => (
                    <tr
                      key={row.skuId}
                      className={`transition-colors ${
                        row.unavailable
                          ? 'bg-red-50 opacity-60'
                          : row.qty > 0
                          ? 'bg-brand-blue/5'
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          {row.imageUrl ? (
                            <img
                              src={row.imageUrl}
                              alt={row.colorName}
                              className="h-9 w-9 rounded-lg object-cover shrink-0 border border-gray-100"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : null}
                          <span className="flex flex-col gap-0.5">
                            <span className="text-gray-800 font-medium leading-tight">{row.colorName}</span>
                            {row.colorHex && (
                              <span
                                className="h-3 w-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: row.colorHex }}
                              />
                            )}
                          </span>
                          {row.unavailable && (
                            <span className="rounded-full bg-red-100 text-red-700 text-[10px] px-2 py-0.5 font-bold">
                              Unavailable
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.sizeLabel}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold">{fmt.format(row.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <QtyInput
                          value={row.qty}
                          onChange={(v) => setQty(row.skuId, v)}
                          disabled={row.unavailable || submitting}
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {row.qty > 0 ? fmt.format(row.price * row.qty) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {total > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-700 text-right">
                        Estimated Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-brand-blue text-base">
                        {fmt.format(total)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          {/* STEP B — Optional note */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white text-xs font-bold">2</span>
              Add a Note <span className="text-xs font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
            </h3>
            <div className="relative">
              <textarea
                value={note}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setNote(e.target.value);
                }}
                placeholder="Add a note to your request (optional)"
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-none"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {note.length}/500
              </span>
            </div>
          </section>

          {/* STEP C — Address */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white text-xs font-bold">3</span>
              Delivery Address
            </h3>
            <AddressStep
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              phoneError={phoneError}
            />
          </section>

          {/* Submit */}
          {submitError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {submitError}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedAddressId}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-blue/90 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Quote Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
