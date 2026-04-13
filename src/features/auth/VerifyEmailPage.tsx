'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/i18n/navigation';
import { extractApiError } from '@/lib/extractApiError';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(1, 'Verification code is required'),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailPage() {
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get('email') ?? '';
  const [globalError, setGlobalError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = async (values: FormValues) => {
    setGlobalError('');
    setResendSuccess('');
    try {
      await verifyEmail(values);
      router.push('/login' as never);
    } catch (err) {
      setGlobalError(extractApiError(err));
    }
  };

  const handleResend = async () => {
    setGlobalError('');
    setResendSuccess('');
    setResending(true);
    try {
      await resendVerification({ email: getValues('email') });
      setResendSuccess('A new code has been sent to your email.');
    } catch (err) {
      setGlobalError(extractApiError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter the code we sent to your email address.
            </p>
          </div>

          {globalError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {globalError}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {resendSuccess}
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
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                placeholder="123456"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-xs text-red-600">{errors.code.message}</p>
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
                'Verify email'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Didn&apos;t receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-brand-blue font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend'}
            </button>
          </p>

          <p className="mt-2 text-center text-sm text-gray-500">
            <Link href="/login" className="text-brand-blue hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
