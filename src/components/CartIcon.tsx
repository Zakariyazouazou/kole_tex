'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartIconProps {
  onClick?: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center text-gray-700 hover:text-brand-blue transition-colors cursor-pointer"
      aria-label="Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      
      {cartCount > 0 && (
        <span 
          className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-blue px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}