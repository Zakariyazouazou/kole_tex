import { useAuth } from '@/context/AuthContext';
import type {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';

/** Thin hooks that delegate directly to AuthContext methods. */

export function useLogin() {
  const { login } = useAuth();
  return (data: LoginPayload) => login(data);
}

export function useRegister() {
  const { register } = useAuth();
  return (data: RegisterPayload) => register(data);
}

export function useVerifyEmail() {
  const { verifyEmail } = useAuth();
  return (data: VerifyEmailPayload) => verifyEmail(data);
}

export function useResendVerification() {
  const { resendVerification } = useAuth();
  return (data: { email: string }) => resendVerification(data);
}

export function useForgotPassword() {
  const { forgotPassword } = useAuth();
  return (data: { email: string }) => forgotPassword(data);
}

export function useChangePassword() {
  const { changePassword } = useAuth();
  return (data: ChangePasswordPayload) => changePassword(data);
}

export function useLogout() {
  const { logout } = useAuth();
  return logout;
}

export function useGoogleLogin() {
  const { googleLogin } = useAuth();
  return (idToken: string) => googleLogin(idToken);
}
