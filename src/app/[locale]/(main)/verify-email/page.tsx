import { Suspense } from 'react';
import { VerifyEmailPage } from '@/features/auth/VerifyEmailPage';

export default function VerifyEmailRoute() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}