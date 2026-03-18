'use client';

import { Heart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface WishlistIconProps {
  count?: number;
}

export function WishlistIcon({ count = 0 }: WishlistIconProps) {
  const locale = useLocale();

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center text-gray-700 hover:text-brand-blue transition-colors cursor-pointer"
      aria-label="Wishlist"
    >
      <Heart className="h-6 w-6" />
      
      {count > 0 && (
        <span 
          className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-blue px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
