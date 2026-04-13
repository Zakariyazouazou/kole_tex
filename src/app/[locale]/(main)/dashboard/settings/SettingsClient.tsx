'use client';

import { useAuth } from '@/context/AuthContext';
import { extractApiError } from '@/lib/extractApiError';
import { protectedApi } from '@/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useRouter } from '@/i18n/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddressFormModal } from '@/app/[locale]/(main)/addresses/AddressFormModal';
import type { Address } from '@/types/address.types';
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  MapPin,
} from 'lucide-react';

// ─── Password form ─────────────────────────────────────────────────────────

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

function PasswordSection() {
  const { changePassword } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordForm) => {
    setError('');
    setSuccess(false);
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccess(true);
      reset();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Password</h2>
      <p className="text-sm text-gray-500 mb-6">Update your account password.</p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Password updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label>Current password</Label>
          <div className="relative">
            <Input type={showCurrent ? 'text' : 'password'} placeholder="••••••••" className="pr-10" {...register('currentPassword')} />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>New password</Label>
          <div className="relative">
            <Input type={showNew ? 'text' : 'password'} placeholder="••••••••" className="pr-10" {...register('newPassword')} />
            <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Confirm new password</Label>
          <div className="relative">
            <Input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="pr-10" {...register('confirmPassword')} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
        </Button>
      </form>
    </div>
  );
}

// ─── Email section (real API) ────────────────────────────────────────────────

const emailSchema = z.object({
  newEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type EmailForm = z.infer<typeof emailSchema>;

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema), defaultValues: { newEmail: '', password: '' } });

  const onSubmit = async (values: EmailForm) => {
    setError(null);
    try {
      await protectedApi.updateMeEmail(values);
      await logout();
      router.replace('/login' as never);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Email address</h2>
      <p className="text-sm text-gray-500 mb-4">
        Current: <span className="font-medium text-gray-800">{currentEmail}</span>
      </p>

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
        <span>
          Changing your email will <strong>log you out</strong>. You will need to verify your new email.
        </span>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label>New email *</Label>
          <Input type="email" placeholder="new@example.com" {...register('newEmail')} />
          {errors.newEmail && (
            <p className="text-xs text-red-600">{errors.newEmail.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Current password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Change email'}
        </Button>
      </form>
    </div>
  );
}

// ─── Addresses section (real API) ────────────────────────────────────────────

function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenCreate = () => {
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditAddress(addr);
    setModalOpen(true);
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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-900">Delivery Addresses</h2>
        <Button size="sm" variant="outline" onClick={handleOpenCreate} className="gap-1">
          <Plus className="h-4 w-4" /> Add address
        </Button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Manage your saved delivery addresses.</p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-6 w-6 border-2 border-brand-blue border-t-transparent rounded-full" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 border border-dashed border-gray-200 rounded-xl text-center">
          <MapPin className="h-7 w-7 text-gray-300" />
          <p className="text-sm text-gray-400">No addresses saved yet.</p>
          <Button size="sm" variant="outline" onClick={handleOpenCreate} className="mt-1 gap-1">
            <Plus className="h-3.5 w-3.5" /> Add your first address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4"
            >
              <div className="flex-1 min-w-0 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{addr.fullName}</p>
                  {addr.isDefault && (
                    <Badge className="bg-brand-blue/10 text-brand-blue border-0 text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500">{addr.phoneNumber}</p>
                <p className="text-gray-500">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-gray-500">{addr.addressLine2}</p>}
                <p className="text-gray-500">
                  {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}
                </p>
                <p className="text-gray-500">{addr.country}</p>
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
        onClose={() => { setModalOpen(false); setEditAddress(null); }}
        onSuccess={fetchAddresses}
        editAddress={editAddress}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Address</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            Delete the address for <span className="font-semibold">{deleteTarget?.fullName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SettingsClient() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Account settings</h1>
        <p className="text-sm text-gray-500">Manage your profile, addresses and security.</p>
      </div>

      {/* Email verification banner */}
      {user && !user.isEmailVerified && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
          <span className="flex-1 font-medium">
            Your email is not verified. Some features may be restricted until you verify.
          </span>
          <Link
            href={`/verify-email?email=${encodeURIComponent(user.email)}` as never}
            className="shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600 transition-colors"
          >
            Verify Email
          </Link>
        </div>
      )}

      {/* Profile info (read-only) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Your account information from the server.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="space-y-1.5">
            <Label>First name</Label>
            <Input value={user?.firstName ?? ''} readOnly className="bg-gray-50 text-gray-700" />
          </div>
          <div className="space-y-1.5">
            <Label>Last name</Label>
            <Input value={user?.lastName ?? ''} readOnly className="bg-gray-50 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Email */}
      {user && <EmailSection currentEmail={user.email} />}

      {/* Addresses — CUSTOMER only */}
      {user?.role === 'CUSTOMER' && <AddressesSection />}

      {/* Password */}
      <PasswordSection />
    </div>
  );
}

