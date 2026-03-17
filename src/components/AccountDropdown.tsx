'use client';

import { useApp } from '@/context/AppContext';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { User, LogOut, LayoutDashboard, ChevronDown, LogIn, UserPlus, Package, Heart, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function AccountDropdown() {
  const { isAuthenticated, user, logout } = useApp();
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-700 hover:text-brand-blue transition-colors cursor-pointer"
        aria-label={t('account')}
      >
        <User className="h-5 w-5" />
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] z-20 animate-in fade-in zoom-in-95 duration-200">          {isAuthenticated ? (
          <>
            {/* User Header */}
            <div className="px-3 py-2 mb-1 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Authenticated Links */}
            <div className="space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-gray-400" />
                {t('dashboard')}
              </Link>

              {/* New: My Orders */}
              <Link
                href="#"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
              >
                <Package className="h-4 w-4 text-gray-400" />
                orders
              </Link>

              {/* New: Wishlist */}
              <Link
                href="#"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
              >
                <Heart className="h-4 w-4 text-gray-400" />
                wishlist
              </Link>

              {/* New: Settings */}
              <Link
                href="#"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                settings
              </Link>

              {/* Subtle Divider before Logout */}
              <div className="h-px bg-gray-100 my-1 mx-2"></div>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                {t('logout')}
              </button>
            </div>
          </>
        ) : (
          /* Unauthenticated Links - FIXED FOR CLARITY */
          <div className="space-y-0.5">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
            >
              <LogIn className="h-4 w-4 text-gray-400" />
              {t('login')}
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
            >
              <UserPlus className="h-4 w-4 text-gray-400" />
              {t('register')}
            </Link>
          </div>
        )}
        </div>
      )}
    </div>
  );
}