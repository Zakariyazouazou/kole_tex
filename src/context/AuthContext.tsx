'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

export interface User {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  loginWithGoogle: () => void;
  register: (data: Partial<User> & { email: string; name: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(loadFromStorage<User | null>('ecom_user', null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage('ecom_user', user);
  }, [user, hydrated]);

  const login = useCallback((_email: string, _password: string) => {
    const mockUser: User = {
      name: 'John Doe',
      email: _email,
      phone: '+1 555-0123',
      address: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      country: 'US',
    };
    setUser(mockUser);
  }, []);

  const loginWithGoogle = useCallback(() => {
    const mockGoogleUser: User = {
      name: 'Jane Smith',
      email: 'jane.smith@gmail.com',
      phone: '+1 555-0456',
      company: 'Google Inc.',
      address: '1600 Amphitheatre Parkway',
      city: 'Mountain View',
      postalCode: '94043',
      country: 'US',
    };
    setUser(mockGoogleUser);
  }, []);

  const register = useCallback(
    (data: Partial<User> & { email: string; name: string }) => {
      const newUser: User = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      };
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
