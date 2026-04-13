import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
