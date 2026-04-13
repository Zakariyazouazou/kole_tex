'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after the silent refresh has resolved
    if (!isLoading && !isAuthenticated) {
      router.push('/login' as never);
    }
  }, [isLoading, isAuthenticated, router]);

  // While the silent refresh is in flight, show a spinner — never redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  // Refresh resolved but user is not authenticated — redirect pending
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}

