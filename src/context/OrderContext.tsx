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
import { useCart, CartItem } from './CartContext';

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: () => Order;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { cart, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(loadFromStorage<Order[]>('ecom_orders', []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage('ecom_orders', orders);
  }, [orders, hydrated]);

  const placeOrder = useCallback((): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      status: 'pending',
      items: [...cart],
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  }, [cart, clearCart]);

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
