'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Link } from '@/i18n/navigation';
import { protectedApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';

// ─── Section 1: Profile Info ──────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileInfoSection() {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setError(null);
    setSuccess(false);
    try {
      const updatedUser = await protectedApi.updateMe({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber || undefined,
      });
      updateUser(updatedUser);
      setSuccess(true);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Profile Information</h2>
      <p className="text-sm text-gray-500 mb-6">Update your name and phone number.</p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>First name *</Label>
            <Input placeholder="John" {...register('firstName')} />
            {errors.firstName && (
              <p className="text-xs text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Last name *</Label>
            <Input placeholder="Doe" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-xs text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Phone number</Label>
          <Input placeholder="+1 555 000 0000" {...register('phoneNumber')} />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}

// ─── Section 2: Change Email ──────────────────────────────────────────────────

const emailSchema = z.object({
  newEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

function ChangeEmailSection() {
  const { logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (values: EmailFormValues) => {
    setError(null);
    try {
      await protectedApi.updateMeEmail(values);
      // Backend clears the httpOnly cookie — clear the in-memory token too
      await logout();
      router.replace('/login' as never);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Change Email</h2>
      <p className="text-sm text-gray-500 mb-4">Update the email address linked to your account.</p>

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
        <span>
          Changing your email will <strong>log you out</strong>. You will need to verify your new
          email before signing back in.
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

// ─── Section 3: Change Password ───────────────────────────────────────────────

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function ChangePasswordSection() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordFormValues) => {
    setError(null);
    setSuccess(false);
    try {
      await protectedApi.updateMePassword({
        currentPassword: values.currentPassword,
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
      <h2 className="text-base font-semibold text-gray-900 mb-1">Change Password</h2>
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
          <Label>Current password *</Label>
          <div className="relative">
            <Input
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>New password *</Label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Confirm new password *</Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
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

// ─── Main ProfilePage ─────────────────────────────────────────────────────────

export function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login' as never);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information and security settings.
        </p>
      </div>

      {user && !user.isEmailVerified && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
          <span className="font-medium">Your email is not verified. Some features may be restricted.</span>
        </div>
      )}

      {/* Section 1 — Profile Info */}
      <ProfileInfoSection />

      {/* Section 2 — Change Email */}
      <ChangeEmailSection />

      {/* Section 3 — Change Password */}
      <ChangePasswordSection />

      {/* Section 4 — Language Preference */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Email Language</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose the language for transactional emails like verification codes, password resets, and order confirmations.
        </p>
        <LanguageSelector />
      </div>

      {/* Section 5 — Addresses shortcut (CUSTOMER only) */}
      {user?.role === 'CUSTOMER' && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Delivery Addresses</h2>
            <p className="text-sm text-gray-500">View and manage your saved addresses.</p>
          </div>
          <Link href="/addresses" className="shrink-0">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" /> Manage addresses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
