'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────
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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  loginWithGoogle: () => void;
  register: (data: Partial<User> & { email: string; name: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Orders
  orders: Order[];
  placeOrder: () => Order;
  getOrderById: (id: string) => Order | undefined;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// ─── Helpers ──────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Provider ─────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setUser(loadFromStorage<User | null>('ecom_user', null));
    setCart(loadFromStorage<CartItem[]>('ecom_cart', []));
    setOrders(loadFromStorage<Order[]>('ecom_orders', []));
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage('ecom_user', user);
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage('ecom_cart', cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage('ecom_orders', orders);
  }, [orders, hydrated]);

  // ─── Auth ───────────────────────────────────────────────────────
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

  // ─── Cart ───────────────────────────────────────────────────────
  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const key = item.variant ? `${item.id}-${item.variant}` : item.id;
      const existing = prev.find(
        (i) => (i.variant ? `${i.id}-${i.variant}` : i.id) === key
      );
      if (existing) {
        return prev.map((i) =>
          (i.variant ? `${i.id}-${i.variant}` : i.id) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ─── Orders ─────────────────────────────────────────────────────
  const placeOrder = useCallback((): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      status: 'pending',
      items: [...cart],
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  }, [cart]);

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const isAuthenticated = !!user;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        getOrderById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
