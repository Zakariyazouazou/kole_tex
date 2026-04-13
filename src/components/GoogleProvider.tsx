'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleProvider({ children }: { children: ReactNode }) {
  if (!clientId) {
    // GoogleOAuthProvider requires a non-empty clientId.
    // When NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set, render children as-is.
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
