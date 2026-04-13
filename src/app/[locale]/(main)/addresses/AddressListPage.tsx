'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { Address } from '@/types/address.types';
import { AddressFormModal } from './AddressFormModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

export function AddressListPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Role guard: CUSTOMER only — admins go to their dashboard
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.replace('/dashboard' as never);
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await protectedApi.getMyAddresses();
      setAddresses(data);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'CUSTOMER') {
      fetchAddresses();
    }
  }, [authLoading, isAuthenticated, user, fetchAddresses]);

  const handleOpenCreate = () => {
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditAddress(addr);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditAddress(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await protectedApi.deleteAddress(deleteTarget.id);
      setDeleteTarget(null);
      fetchAddresses();
    } catch (err) {
      setError(extractApiError(err));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Show spinner while auth is resolving or while redirecting
  if (authLoading || !isAuthenticated || user?.role !== 'CUSTOMER') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved delivery addresses.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Add address
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <MapPin className="h-10 w-10 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium mb-2">No addresses yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Add your first delivery address to get started.
          </p>
          <Button
            onClick={handleOpenCreate}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white gap-2"
          >
            <Plus className="h-4 w-4" /> Add your first address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="font-semibold text-gray-900">{addr.fullName}</p>
                  {addr.isDefault && (
                    <Badge className="bg-brand-blue/10 text-brand-blue border-0 text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{addr.phoneNumber}</p>
                <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                {addr.addressLine2 && (
                  <p className="text-sm text-gray-600">{addr.addressLine2}</p>
                )}
                <p className="text-sm text-gray-600">
                  {addr.city}
                  {addr.state ? `, ${addr.state}` : ''} {addr.postalCode}
                </p>
                <p className="text-sm text-gray-600">{addr.country}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenEdit(addr)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 text-red-500 hover:border-red-300"
                  onClick={() => setDeleteTarget(addr)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={fetchAddresses}
        editAddress={editAddress}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            Delete the address for{' '}
            <span className="font-semibold">{deleteTarget?.fullName}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
