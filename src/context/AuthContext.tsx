'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { publicApi, protectedApi, setAccessToken } from '@/api';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type {
  User,
  AuthState,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  ChangePasswordPayload,
  MessageResponse,
  PreferredLanguage,
} from '@/types/auth.types';
import { detectBrowserLanguage } from '@/lib/language-utils';

// Re-export User for backward-compat with AppContext
export type { User };

const USER_STORAGE_KEY = 'auth_user';

interface AuthContextType extends AuthState {
  isAdmin: boolean;
  login: (data: LoginPayload) => Promise<User>;
  register: (data: RegisterPayload) => Promise<MessageResponse>;
  verifyEmail: (data: VerifyEmailPayload) => Promise<MessageResponse>;
  resendVerification: (data: { email: string }) => Promise<MessageResponse>;
  forgotPassword: (data: { email: string }) => Promise<MessageResponse>;
  changePassword: (data: ChangePasswordPayload) => Promise<MessageResponse>;
  logout: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<User>;
  updateUser: (user: User) => void;
  setUserLanguage: (language: PreferredLanguage) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Silent refresh on mount — restores session from the httpOnly refresh cookie.
  // User data is rehydrated from localStorage (non-sensitive profile cache).
  useEffect(() => {
    const cachedUser = loadFromStorage<User | null>(USER_STORAGE_KEY, null);

    publicApi
      .refresh()
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        setState({ user: cachedUser, isAuthenticated: true, isLoading: false });
      })
      .catch(() => {
        setAccessToken(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (data: LoginPayload): Promise<User> => {
    const res = await publicApi.login(data);
    setAccessToken(res.accessToken);
    saveToStorage(USER_STORAGE_KEY, res.user);
    setState({ user: res.user, isAuthenticated: true, isLoading: false });

    // Set language preference after successful login
    try {
      const language = detectBrowserLanguage();
      const updatedUser = await protectedApi.setUserLanguage(language);
      saveToStorage(USER_STORAGE_KEY, updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (err) {
      // Silently fail language setting, don't interrupt login
      console.warn('Failed to set user language:', err);
    }

    return res.user;
  }, []);

  const register = useCallback(
    (data: RegisterPayload): Promise<MessageResponse> =>
      publicApi.register(data),
    []
  );

  const verifyEmail = useCallback(
    (data: VerifyEmailPayload): Promise<MessageResponse> =>
      publicApi.verifyEmail(data),
    []
  );

  const resendVerification = useCallback(
    (data: { email: string }): Promise<MessageResponse> =>
      publicApi.resendVerification(data),
    []
  );

  const forgotPassword = useCallback(
    (data: { email: string }): Promise<MessageResponse> =>
      publicApi.forgotPassword(data),
    []
  );

  const changePassword = useCallback(
    (data: ChangePasswordPayload): Promise<MessageResponse> =>
      protectedApi.changePassword(data),
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await protectedApi.logout();
    } finally {
      setAccessToken(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const googleLogin = useCallback(async (idToken: string): Promise<User> => {
    const res = await publicApi.googleAuth({ idToken });
    setAccessToken(res.accessToken);
    saveToStorage(USER_STORAGE_KEY, res.user);
    setState({ user: res.user, isAuthenticated: true, isLoading: false });

    // Set language preference after successful Google login
    try {
      const language = detectBrowserLanguage();
      const updatedUser = await protectedApi.setUserLanguage(language);
      saveToStorage(USER_STORAGE_KEY, updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (err) {
      // Silently fail language setting, don't interrupt login
      console.warn('Failed to set user language:', err);
    }

    return res.user;
  }, []);

  const updateUser = useCallback((updatedUser: User): void => {
    saveToStorage(USER_STORAGE_KEY, updatedUser);
    setState((prev) => ({ ...prev, user: updatedUser }));
  }, []);

  const setUserLanguage = useCallback(
    async (language: PreferredLanguage): Promise<User> => {
      const updatedUser = await protectedApi.setUserLanguage(language);
      saveToStorage(USER_STORAGE_KEY, updatedUser);
      setState((prev) => ({ ...prev, user: updatedUser }));
      return updatedUser;
    },
    []
  );

  const isAdmin = state.user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAdmin,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        changePassword,
        logout,
        googleLogin,
        updateUser,
        setUserLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

