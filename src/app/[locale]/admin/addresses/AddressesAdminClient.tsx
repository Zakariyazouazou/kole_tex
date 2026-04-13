'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, ChevronLeft, ChevronRight, Search, Pencil, Eye, Loader2 } from 'lucide-react';
import type { AdminAddress } from '@/lib/admin-api';
import { adminApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';

const LIMIT_OPTIONS = [10, 20, 50] as const;
type LimitOption = (typeof LIMIT_OPTIONS)[number];

// ─── Edit form ────────────────────────────────────────────────────────────────

const editSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  phoneNumber: z.string().min(1, 'Required'),
  addressLine1: z.string().min(1, 'Required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  isDefault: z.boolean(),
});
type EditForm = z.infer<typeof editSchema>;

function EditModal({
  address,
  onClose,
  onSaved,
}: {
  address: AdminAddress;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<EditForm>({
      resolver: zodResolver(editSchema),
      defaultValues: {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? '',
        city: address.city,
        state: address.state ?? '',
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      },
    });

  const isDefault = watch('isDefault');

  const onSubmit = async (values: EditForm) => {
    setError(null);
    try {
      await adminApi.updateAddress(address.id, values);
      onSaved();
      onClose();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Address — {address.fullName}</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input {...register('fullName')} />
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input {...register('phoneNumber')} />
              {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Address Line 1 *</Label>
            <Input {...register('addressLine1')} />
            {errors.addressLine1 && <p className="text-xs text-red-600">{errors.addressLine1.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Address Line 2</Label>
            <Input {...register('addressLine2')} placeholder="Apt, suite, etc." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input {...register('city')} />
              {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>State / Region</Label>
              <Input {...register('state')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Postal Code *</Label>
              <Input {...register('postalCode')} />
              {errors.postalCode && <p className="text-xs text-red-600">{errors.postalCode.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Country *</Label>
              <Input {...register('country')} />
              {errors.country && <p className="text-xs text-red-600">{errors.country.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(v) => setValue('isDefault', !!v)}
            />
            <Label htmlFor="isDefault" className="cursor-pointer">Set as default address</Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-800 hover:bg-slate-900 text-white">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function DetailModal({
  addressId,
  onClose,
}: {
  addressId: string;
  onClose: () => void;
}) {
  const [address, setAddress] = useState<AdminAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getAddress(addressId)
      .then(setAddress)
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setIsLoading(false));
  }, [addressId]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Address Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        {address && (
          <div className="space-y-3 mt-2 text-sm">
            <Row label="Full Name" value={address.fullName} />
            <Row label="Phone" value={address.phoneNumber} />
            <Row label="Address Line 1" value={address.addressLine1} />
            {address.addressLine2 && <Row label="Address Line 2" value={address.addressLine2} />}
            <Row label="City" value={address.city} />
            {address.state && <Row label="State / Region" value={address.state} />}
            <Row label="Postal Code" value={address.postalCode} />
            <Row label="Country" value={address.country} />
            <Row label="User ID" value={<span className="font-mono text-xs text-gray-500">{address.userId}</span>} />
            <Row
              label="Default"
              value={
                <Badge variant={address.isDefault ? 'default' : 'secondary'}>
                  {address.isDefault ? 'Yes' : 'No'}
                </Badge>
              }
            />
            {address.createdAt && (
              <Row label="Created" value={new Date(address.createdAt).toLocaleString()} />
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-36 shrink-0 text-gray-400 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

export function AddressesAdminClient() {
  const [addresses, setAddresses] = useState<AdminAddress[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<LimitOption>(10);
  const [filterInput, setFilterInput] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminAddress | null>(null);
  const [detailTargetId, setDetailTargetId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / limit) || 1;

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllAddresses(page, limit, appliedFilter || undefined);
      setAddresses(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, appliedFilter]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleFilterSubmit = () => {
    setPage(1);
    setAppliedFilter(filterInput);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteAddress(deleteTarget.id);
      setDeleteTarget(null);
      fetchAddresses();
    } catch (err) {
      setError(extractApiError(err));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Addresses" description={`${total} saved addresses`} />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Filter by User ID</Label>
          <Input
            className="h-9 text-sm w-72"
            placeholder="Enter user UUID…"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
          />
        </div>
        <Button size="sm" variant="outline" className="h-9" onClick={handleFilterSubmit}>
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Full Name', 'City', 'Country', 'Postal Code', 'Default', 'User ID', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-slate-800 border-t-transparent rounded-full" />
                    </div>
                  </td>
                </tr>
              ) : addresses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No addresses found.
                  </td>
                </tr>
              ) : (
                addresses.map((addr) => (
                  <tr key={addr.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{addr.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{addr.city}</td>
                    <td className="px-4 py-3 text-gray-500">{addr.country}</td>
                    <td className="px-4 py-3 text-gray-500">{addr.postalCode}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${addr.isDefault ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {addr.isDefault ? 'Default' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{addr.userId}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{addr.createdAt ? new Date(addr.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDetailTargetId(addr.id)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500"
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditTarget(addr)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-slate-700"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(addr)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{total} addresses total</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">Per page:</span>
              {LIMIT_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLimit(l); setPage(1); }}
                  className={`px-2 py-0.5 rounded text-xs border ${limit === l ? 'bg-slate-800 text-white border-slate-800' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isLoading}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Address</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            Delete the address for{' '}
            <span className="font-semibold">{deleteTarget?.fullName}</span> in{' '}
            <span className="font-semibold">{deleteTarget?.city}, {deleteTarget?.country}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {editTarget && (
        <EditModal
          address={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={fetchAddresses}
        />
      )}

      {detailTargetId && (
        <DetailModal
          addressId={detailTargetId}
          onClose={() => setDetailTargetId(null)}
        />
      )}
    </div>
  );
}
