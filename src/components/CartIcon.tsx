'use client';

import { ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CartIconProps {
  onClick?: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { cartCount } = useApp();

  return (
    <button
      onClick={onClick}
      className="relative text-gray-700 hover:text-brand-blue transition-colors cursor-pointer"
      aria-label="Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-[10px] font-bold text-white">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}
