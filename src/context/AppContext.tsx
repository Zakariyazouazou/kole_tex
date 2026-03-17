'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth, User } from './AuthContext';
import { CartProvider, useCart, CartItem } from './CartContext';
import { OrderProvider, useOrders, Order } from './OrderContext';

// Re-export types for backward compatibility
export type { User, CartItem, Order };

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>{children}</OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

/**
 * useApp hook consolidates all contexts for backward compatibility.
 * New code should favor using useAuth(), useCart(), or useOrders() directly.
 */
export const useApp = () => {
  const auth = useAuth();
  const cart = useCart();
  const orders = useOrders();

  return {
    ...auth,
    ...cart,
    ...orders,
  };
};
