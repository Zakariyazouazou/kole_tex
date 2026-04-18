'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { AccountDropdown } from '@/components/AccountDropdown';
import { WishlistIcon } from '@/components/WishlistIcon';
import { publicApi } from '@/api';
import type { Category as ApiCategory } from '@/types/product.types';

// Sub-components
import { HamburgerButton } from './header/HamburgerButton';
import { TopUtilityBar } from './header/TopUtilityBar';
import { HeaderSearchBar } from './header/HeaderSearchBar';
import { CatalogueSheet } from './header/CatalogueSheet';

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();

  const [catalogueSheetOpen, setCatalogueSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [scrolled, setScrolled] = useState(false);

  // Fetch API categories whenever locale changes
  useEffect(() => {
    const lang = locale as 'en' | 'fr' | 'de';
    publicApi.getCategories(lang).then(setApiCategories).catch(() => {});
  }, [locale]);

  // Scroll detection with a transition lock
  useEffect(() => {
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;

    const lock = () => {
      if (lockTimer) clearTimeout(lockTimer);
      locked = true;
      lockTimer = setTimeout(() => { locked = false; }, 600);
    };

    const onScroll = () => {
      if (locked) return;
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > 1) { lock(); return true; }
        if (prev && y === 0) { lock(); return false; }
        return prev;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    setScrolled(window.scrollY > 1);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, []);

  // Reset scroll state on route change
  useEffect(() => {
    setScrolled(false);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => { setScrolled(window.scrollY > 1); }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-30 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
          : 'bg-white border-b border-gray-100'
      }`}>
        {/* Row 1: Utility Bar */}
        <TopUtilityBar scrolled={scrolled} />

        {/* Row 2: Logo, Search, Icons */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3">
              {/* Hamburger — visible only when scrolled, on all screen sizes */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ 
                  width: 22, 
                 }}
              >
                <HamburgerButton
                  open={catalogueSheetOpen}
                  onClick={() => setCatalogueSheetOpen((v) => !v)}
                  size="sm"
                />
              </div>

              {/* Brand Logo */}
              <Link href="/" className="shrink-0">
                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                  <span className="text-brand-blue">kole</span>
                  <span className="text-gray-800"> tex</span>
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <HeaderSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchCategory={searchCategory}
              setSearchCategory={setSearchCategory}
              handleSearch={handleSearch}
              apiCategories={apiCategories}
            />

            {/* User Actions */}
            <div className="flex items-center gap-5">
              <AccountDropdown />
              <WishlistIcon count={0} />
            </div>
          </div>
        </div>
      </header>

      {/* Catalogue Sheet — categories + accordion subcategories */}
      <CatalogueSheet
        open={catalogueSheetOpen}
        onOpenChange={setCatalogueSheetOpen}
        apiCategories={apiCategories}
      />
    </>
  );
}
