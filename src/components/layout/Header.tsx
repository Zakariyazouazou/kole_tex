'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AccountDropdown } from '@/components/AccountDropdown';
import { WishlistIcon } from '@/components/WishlistIcon';
import { CartIcon } from '@/components/CartIcon';
import { CartSidebar } from '@/components/CartSidebar';
import { useCart } from '@/context/CartContext';
import { categories } from '@/lib/categories';
import { publicApi } from '@/api';
import type { Category as ApiCategory } from '@/types/product.types';

// Sub-components
import { HamburgerButton } from './header/HamburgerButton';
import { TopUtilityBar } from './header/TopUtilityBar';
import { HeaderSearchBar } from './header/HeaderSearchBar';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileSideMenu } from './header/MobileSideMenu';

/**
 * Main Header orchestrator
 * Breaks down Row 1 (Utility), Row 2 (Logo/Search/Icons), and Row 3 (Nav) 
 * into smaller, focused components for better maintainability.
 */
export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const { isCartOpen, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string>(categories[0]?.slug || '');
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);

  const [scrolled, setScrolled] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState<boolean>(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  // Fetch API categories whenever locale changes
  useEffect(() => {
    const lang = locale as 'en' | 'fr' | 'de';
    publicApi.getCategories(lang).then(setApiCategories).catch(() => {});
  }, [locale]);

  // Scroll detection with a transition lock:
  // After any state flip, ignore scroll events for 600 ms so that the
  // browser's scroll-anchoring adjustment (caused by the header shrinking)
  // cannot immediately trigger the opposite state and create a flicker loop.
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
        if (!prev && y > 1) { lock(); return true; }   // collapse at any meaningful scroll
        if (prev && y === 0) { lock(); return false; }  // restore only when truly at top
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

    const timer = setTimeout(() => {
      setScrolled(window.scrollY > 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Sync desktop nav with scroll state
  useEffect(() => {
    if (!scrolled) setDesktopNavOpen(false);
  }, [scrolled]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMobileMenuOpen(false);
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Nav hover handlers
  const handleNavEnter = useCallback((id: string) => {
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    setActiveNav(id);
    if (id === 'shop-by-categories') setHoveredCategory(categories[0]?.slug || '');
  }, []);

  const handleNavLeave = useCallback(() => {
    navTimeoutRef.current = setTimeout(() => setActiveNav(null), 150);
  }, []);

  const toggleMobileAccordion = (slug: string) => {
    setMobileAccordion((prev) => (prev === slug ? null : slug));
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
        <div className="mx-auto max-w-7xl px-4 ">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3">
              {/* Desktop hamburger (visible only when scrolled) */}
              <div
                className="hidden lg:block overflow-hidden transition-all duration-300 ease-in-out"
                style={{ width: scrolled ? 22 : 0, opacity: scrolled ? 1 : 0 }}
              >
                <HamburgerButton
                  open={desktopNavOpen}
                  onClick={() => setDesktopNavOpen((v) => !v)}
                  size="md"
                />
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <HamburgerButton
                  open={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((v) => !v)}
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

            {/* Desktop Search */}
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
              {/* CartIcon hidden while quote system is active */}
              {/* <CartIcon onClick={() => setIsCartOpen(true)} /> */}
            </div>
          </div>
        </div>

        {/* Row 3: Desktop Navigation */}
        <DesktopNavigation
          scrolled={scrolled}
          desktopNavOpen={desktopNavOpen}
          activeNav={activeNav}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
          handleNavEnter={handleNavEnter}
          handleNavLeave={handleNavLeave}
          apiCategories={apiCategories}
        />
      </header>

      {/* Mobile Off-canvas Navigation */}
      <MobileSideMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        mobileAccordion={mobileAccordion}
        toggleMobileAccordion={toggleMobileAccordion}
        apiCategories={apiCategories}
      />

      {/* CartSidebar hidden while quote system is active */}
      {/* <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}
