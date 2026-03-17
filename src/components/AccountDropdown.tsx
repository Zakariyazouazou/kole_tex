'use client';

import { useApp } from '@/context/AppContext';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
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
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-gray-100 bg-white py-2 shadow-lg z-50">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard')}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-brand-blue hover:bg-brand-blue-light transition-colors"
              >
                {t('register')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
