"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import { cartApi } from "@/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

// Helper to convert ServerCart or raw backend response to frontend CartItem[]
function mapServerCartToFrontend(serverCart: any): CartItem[] {
  if (!serverCart || !serverCart.items) return [];
  return serverCart.items.map((item: any) => ({
    id: item.skuId,
    name: `${item.sku.product.brand} - ${item.sku.product.catalogReference}`,
    price: item.sku.price,
    quantity: item.quantity,
    image: item.sku.image || "/placeholder.png",
    variant: item.sku.sizeLabel || undefined,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Track previous auth state to only react to transitions, not initial render
  const prevAuthRef = useRef<boolean | null>(null);

  // 1. Load from local storage on mount (guest baseline)
  useEffect(() => {
    setCart(loadFromStorage<CartItem[]>("ecom_cart", []));
    setHydrated(true);
  }, []);

  // 2. Persist to local storage only while NOT authenticated
  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    saveToStorage("ecom_cart", cart);
  }, [cart, hydrated, isAuthenticated]);

  // 3. React to auth state transitions — runs only after auth settles (isLoading=false)
  useEffect(() => {
    if (!hydrated || isLoading) return;

    const prev = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    // Initial settled state (prev was null — first time we know auth status)
    if (prev === null) {
      if (isAuthenticated) {
        // On page load while already logged in: fetch or merge server cart
        (async () => {
          try {
            const localCart = loadFromStorage<CartItem[]>("ecom_cart", []);
            if (localCart.length > 0) {
              const payload = {
                items: localCart.map((i) => ({
                  skuId: i.id,
                  quantity: i.quantity,
                })),
              };
              const merged = await cartApi.mergeGuestCart(payload);
              setCart(mapServerCartToFrontend(merged));
              saveToStorage("ecom_cart", []);
            } else {
              const serverCart = await cartApi.getCart();
              setCart(mapServerCartToFrontend(serverCart));
            }
          } catch (err) {
            console.error("Cart initial fetch failed:", err);
          }
        })();
      }
      // If not authenticated on initial load, guest cart is already in state from effect #1
      return;
    }

    // Transition: guest → logged in
    if (!prev && isAuthenticated) {
      (async () => {
        try {
          const localCart = loadFromStorage<CartItem[]>("ecom_cart", []);
          if (localCart.length > 0) {
            const payload = {
              items: localCart.map((i) => ({
                skuId: i.id,
                quantity: i.quantity,
              })),
            };
            const merged = await cartApi.mergeGuestCart(payload);
            setCart(mapServerCartToFrontend(merged));
            saveToStorage("ecom_cart", []);
          } else {
            const serverCart = await cartApi.getCart();
            setCart(mapServerCartToFrontend(serverCart));
          }
        } catch (err) {
          console.error("Cart merge failed:", err);
        }
      })();
    }

    // Transition: logged in → logged out (clear server items, show local guest cart)
    if (prev && !isAuthenticated) {
      setCart(loadFromStorage<CartItem[]>("ecom_cart", []));
    }
  }, [isAuthenticated, isLoading, hydrated]);

  const addToCart = useCallback(
    async (item: CartItem) => {
      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.addItemToCart({
            skuId: item.id,
            quantity: item.quantity,
          });
          setCart(mapServerCartToFrontend(serverCart));
        } catch (err) {
          console.error("addToCart API failed:", err);
          alert("Failed to add item — it may be out of stock or unavailable.");
        }
      } else {
        setCart((prev) => {
          const key = item.variant ? `${item.id}-${item.variant}` : item.id;
          const existing = prev.find(
            (i) => (i.variant ? `${i.id}-${i.variant}` : i.id) === key,
          );
          if (existing) {
            return prev.map((i) =>
              (i.variant ? `${i.id}-${i.variant}` : i.id) === key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            );
          }
          return [...prev, item];
        });
      }
    },
    [isAuthenticated],
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.removeItemFromCart(id);
          setCart(mapServerCartToFrontend(serverCart));
        } catch (err) {
          console.error("removeFromCart API failed:", err);
        }
      } else {
        setCart((prev) => prev.filter((i) => i.id !== id));
      }
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback(
    async (id: string, qty: number) => {
      if (qty < 1) return;
      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.updateCartItemQty(id, {
            quantity: qty,
          });
          setCart(mapServerCartToFrontend(serverCart));
        } catch (err) {
          console.error("updateQuantity API failed:", err);
          alert("Cannot update quantity — may exceed available stock.");
        }
      } else {
        setCart((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        );
      }
    },
    [isAuthenticated],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        setCart([]);
      } catch (err) {
        console.error("clearCart API failed:", err);
      }
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
