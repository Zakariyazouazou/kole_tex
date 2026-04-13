'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the silent refresh to finish before deciding to redirect
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login' as never);
    } else if (!isAdmin) {
      router.replace('/dashboard' as never);
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Spinner while auth is resolving or while user is being redirected
  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-slate-800 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
