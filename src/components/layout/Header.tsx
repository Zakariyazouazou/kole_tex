'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AccountDropdown } from '@/components/AccountDropdown';
import { CartIcon } from '@/components/CartIcon';
import { CartSidebar } from '@/components/CartSidebar';
import { categories } from '@/lib/categories';

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

  // Shared state logic
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string>(categories[0]?.slug || '');
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState<boolean>(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  // Scroll detection logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            />

            {/* User Actions */}
            <div className="flex items-center gap-5">
              <AccountDropdown />
              <CartIcon onClick={() => setCartOpen(true)} />
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
      />

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
