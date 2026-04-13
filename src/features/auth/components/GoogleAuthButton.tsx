'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { extractApiError } from '@/lib/extractApiError';

interface Props {
  onError?: (msg: string) => void;
  onSuccess?: (role: 'CUSTOMER' | 'ADMIN') => void;
}

/**
 * Inner component — only rendered when GoogleOAuthProvider is present.
 * Uses GoogleLogin (GIS credential flow) which returns an ID token — the same
 * token type the backend's POST /auth/google expects as `idToken`.
 */
function GoogleAuthButtonInner({ onError, onSuccess }: Props) {
  const { googleLogin } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      onError?.('Google did not return a credential. Please try again.');
      return;
    }
    try {
      const user = await googleLogin(idToken);
      onSuccess?.(user.role);
    } catch (err) {
      onError?.(extractApiError(err));
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.('Google sign-in failed. Please try again.')}
        theme="outline"
        size="large"
        width="368"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}

/**
 * Public export — renders nothing when NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set,
 * preventing the component from being mounted outside a GoogleOAuthProvider.
 */
export function GoogleAuthButton(props: Props) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;
  return <GoogleAuthButtonInner {...props} />;
}
