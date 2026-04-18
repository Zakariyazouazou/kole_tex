'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isAxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/i18n/navigation';
import { extractApiError } from '@/lib/extractApiError';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { GoogleAuthButton } from './components/GoogleAuthButton';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  // Read redirect param client-side only — avoids Suspense boundary issues
  const [safeRedirect, setSafeRedirect] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState('');
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('redirect') ?? '';
    setSafeRedirect(raw.startsWith('/') && !raw.startsWith('//') ? raw : null);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setGlobalError('');
    try {
      const user = await login(values);
      const destination = safeRedirect || (user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      router.push(destination as never);
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const apiMsg  = err.response?.data?.message;

        if (status === 400 && apiMsg === 'Please login with Google') {
          setGlobalError('This account uses Google login. Please sign in with Google.');
        } else if (status === 401) {
          setGlobalError('Email or password is incorrect.');
        } else if (status === 400 || status === 422) {
          setGlobalError('Please enter a valid email and password.');
        } else {
          setGlobalError(extractApiError(err));
        }
      } else {
        setGlobalError(extractApiError(err));
      }
    }
  };

  const handleGoogleSuccess = (role: 'CUSTOMER' | 'ADMIN') => {
    const destination = safeRedirect || (role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    router.push(destination as never);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {globalError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-brand-blue-dark cursor-pointer py-5"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {googleError && (
            <p className="mb-2 text-xs text-center text-red-600">{googleError}</p>
          )}
          <GoogleAuthButton
            onError={setGoogleError}
            onSuccess={handleGoogleSuccess}
          />

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href={safeRedirect ? `/register?redirect=${encodeURIComponent(safeRedirect)}` : '/register'}
              className="text-brand-blue font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}