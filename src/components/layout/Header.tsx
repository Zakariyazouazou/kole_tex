'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AccountDropdown } from '@/components/AccountDropdown';
import { CartIcon } from '@/components/CartIcon';
import { CartSidebar } from '@/components/CartSidebar';
import { categories } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';

// ─── Nav data ────────────────────────────────────────────────────────
const navMenuItems = [
  { id: 'shop-by-categories', label: 'Shop By Categories', hasChevron: true, type: 'mega' as const },
  { id: 'new-arrivals', label: 'New Arrivals', hasChevron: true, type: 'dropdown' as const },
  { id: 'collections', label: 'Collections', hasChevron: true, type: 'dropdown' as const },
  { id: 'accessories', label: 'Accessories', hasChevron: false, type: 'link' as const, href: '/products?category=Electronics' },
  { id: 'sale', label: 'ON SALE', hasChevron: false, type: 'link' as const, href: '/products', highlight: true },
];

const newArrivalsDropdown = {
  columns: [
    { title: 'Electronics', links: ['Shop All', 'Audio', 'Wearables', 'Accessories', 'Smart Home', 'Cameras'] },
    { title: 'Clothing', links: ['Shop All', 'Men', 'Women', 'Activewear', 'Outerwear', 'Denim'] },
    { title: 'Home & Kitchen', links: ['Shop All', 'Cookware', 'Organization', 'Decor', 'Bedding', 'Lighting'] },
    { title: 'Trending Now', links: ['Shop All', 'Headphones', 'Sweaters', 'Yoga Mats', 'Candles', 'Water Bottles'] },
    { title: 'Sports', links: ['Shop All', 'Yoga', 'Fitness', 'Running', 'Outdoor', 'Swimming'] },
    { title: 'Accessories', links: ['Shop All', 'Hats', 'Beanies', 'Socks', 'Towels', 'E-gift Card'] },
    { title: 'Campaigns', links: ['Shop All', 'Cashmere Sweaters', 'Surfing Favorites', 'Holiday Specials'] },
    { title: 'Brands', links: ['Shop All', 'Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance'] },
  ],
  promo: { badge: "WINTER'25", title: 'Saving $30 for Pre-Order', image: 'https://picsum.photos/seed/promo1/300/400' },
};

const collectionsDropdown = {
  columns: [
    { title: 'Featured', links: ['Shop All', 'Best Sellers', 'New In', 'Editor Picks', 'Staff Favorites', 'Gift Ideas'] },
    { title: 'By Category', links: ['Shop All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Accessories'] },
    { title: 'Special Prices', links: ['Shop All', 'Under $50', 'Under $100', 'Sale Items', 'Clearance', 'Bundle Deals'] },
    { title: 'On Sale', links: ['Shop All', 'Headphones', 'Sweaters', 'Cookware', 'Yoga Mats', 'Speakers'] },
    { title: 'Seasonal', links: ['Shop All', 'Spring Picks', 'Summer Essentials', 'Fall Favorites', 'Winter Warmers'] },
    { title: 'Lifestyle', links: ['Shop All', 'Work From Home', 'Outdoor Living', 'Minimalist', 'Cozy Nights'] },
    { title: 'Gift Guide', links: ['Shop All', 'For Him', 'For Her', 'For Kids', 'Under $25'] },
  ],
  promo: { badge: 'SPRING 26', title: 'New Collection Available', image: 'https://picsum.photos/seed/promo2/300/400' },
};

// ─── Social SVG icons ────────────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

// ─── Animated Hamburger / X button ───────────────────────────────────
function HamburgerButton({
  open,
  onClick,
  size = 'md',
}: {
  open: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}) {
  const w = size === 'sm' ? 'w-5' : 'w-[22px]';
  const h = size === 'sm' ? 'h-3.5' : 'h-4';
  const ty = size === 'sm' ? 5.5 : 7;

  return (
    <button
      onClick={onClick}
      className={`relative ${w} ${h} flex flex-col justify-between cursor-pointer`}
      aria-label="Menu"
    >
      <span
        className="block h-[1.5px] w-full bg-gray-700 rounded-full transition-all duration-300 ease-in-out origin-center"
        style={{ transform: open ? `translateY(${ty}px) rotate(45deg)` : 'translateY(0) rotate(0)' }}
      />
      <span
        className="block h-[1.5px] w-full bg-gray-700 rounded-full transition-all duration-200 ease-in-out"
        style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'scaleX(1)' }}
      />
      <span
        className="block h-[1.5px] w-full bg-gray-700 rounded-full transition-all duration-300 ease-in-out origin-center"
        style={{ transform: open ? `translateY(-${ty}px) rotate(-45deg)` : 'translateY(0) rotate(0)' }}
      />
    </button>
  );
}

// ─── Nav link with underline animation ───────────────────────────────
function NavLink({
  children,
  href,
  highlight,
  onMouseEnter,
  onMouseLeave,
  active,
}: {
  children: React.ReactNode;
  href?: string;
  highlight?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const showLine = active || hovered;

  const cls = `relative flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer ${
    highlight ? 'text-yellow-300 hover:text-yellow-200' : 'text-white hover:text-white/90'
  }`;

  const underline = (
    <span
      className="absolute bottom-2 left-5 right-5 h-[1.5px] bg-current transition-transform duration-250 ease-in-out origin-left"
      style={{ transform: showLine ? 'scaleX(1)' : 'scaleX(0)' }}
    />
  );

  const handlers = {
    onMouseEnter: () => { setHovered(true); onMouseEnter?.(); },
    onMouseLeave: () => { setHovered(false); onMouseLeave?.(); },
  };

  if (href) {
    return (
      <Link href={href} className={cls} {...handlers}>
        {children}
        {underline}
      </Link>
    );
  }
  return (
    <button className={cls} {...handlers}>
      {children}
      {underline}
    </button>
  );
}

// ─── Dropdown panel (shared for New Arrivals / Collections) ──────────
function DropdownPanel({
  columns,
  promo,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  columns: { title: string; links: string[] }[];
  promo: { badge: string; title: string; image: string };
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className={`absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden z-50 ${
        active ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Columns: flex-wrap, max 4 per row */}
          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-6">
            {columns.map((col) => (
              <div key={col.title} className="w-[calc(25%-24px)] min-w-[160px]">
                <h4 className="text-sm font-bold text-gray-900 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="/products" className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Promo */}
          <div className="w-52 flex-shrink-0">
            <div className="relative rounded-xl overflow-hidden h-full min-h-[250px]">
              <img src={promo.image} alt="Promo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-center justify-end p-5 text-center">
                <span className="text-xs font-semibold text-white/90 bg-brand-blue px-3 py-1 rounded-full mb-2">{promo.badge}</span>
                <p className="text-white text-base font-bold leading-tight mb-3">{promo.title}</p>
                <span className="inline-block bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  Shop Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────
export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();

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

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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

  const activeCat = categories.find((c) => c.slug === hoveredCategory);
  const categoryProducts = activeCat ? getProductsByCategory(activeCat.name).slice(0, 8) : [];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
        {/* ── Row 1: Utility Bar ── */}
        <div
          className="bg-brand-blue text-white text-xs overflow-hidden transition-all duration-400 ease-in-out"
          style={{ maxHeight: scrolled ? 0 : 50, opacity: scrolled ? 0 : 1 }}
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between py-2">
              <div className="hidden md:flex items-center gap-4">
                <a href="#" className="hover:text-white/80 transition-colors">Help Center</a>
                <Link href="/contact" className="hover:text-white/80 transition-colors">Contact</Link>
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs md:text-sm">Free Express Shipping on orders $120!</span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <LanguageSwitcher variant="light" />
                <div className="flex items-center gap-3 ml-2">
                  <a href="#" className="hover:text-white/80 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
                  <a href="#" className="hover:text-white/80 transition-colors" aria-label="X"><XIcon /></a>
                  <a href="#" className="hover:text-white/80 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
                  <a href="#" className="hover:text-white/80 transition-colors" aria-label="TikTok"><TikTokIcon /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Logo, Search, Icons ── */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3">
              {/* Desktop hamburger (scrolled only) */}
              <div
                className="hidden lg:block overflow-hidden transition-all duration-300 ease-in-out"
                style={{ width: scrolled ? 22 : 0, opacity: scrolled ? 1 : 0 }}
              >
                <HamburgerButton open={desktopNavOpen} onClick={() => setDesktopNavOpen((v) => !v)} size="md" />
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <HamburgerButton open={mobileMenuOpen} onClick={() => setMobileMenuOpen((v) => !v)} size="sm" />
              </div>

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                  <span className="text-brand-blue">kole</span>
                  <span className="text-gray-800"> tex</span>
                </span>
              </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="flex w-full rounded-full border border-gray-300 overflow-hidden focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                <div className="relative">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="h-full appearance-none bg-gray-50 border-r border-gray-300 pl-4 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
                  >
                    <option>All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 bg-white py-2.5 px-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 bg-brand-blue text-white hover:bg-brand-blue-dark transition-colors cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-5">
              <AccountDropdown />
              <CartIcon onClick={() => setCartOpen(true)} />
            </div>
          </div>
        </div>

        {/* ── Row 3: Desktop Navigation Bar ── */}
        <nav
          className="hidden lg:block bg-brand-blue overflow-hidden transition-all duration-400 ease-in-out"
          style={{
            maxHeight: !scrolled || desktopNavOpen ? 200 : 0,
            opacity: !scrolled || desktopNavOpen ? 1 : 0,
          }}
        >
          <div className="mx-auto max-w-7xl px-4">
            <ul className="flex items-center">
              {navMenuItems.map((item) => (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.type !== 'link' ? handleNavEnter(item.id) : undefined}
                  onMouseLeave={() => item.type !== 'link' ? handleNavLeave() : undefined}
                >
                  <NavLink
                    href={item.type === 'link' ? (item as { href?: string }).href : undefined}
                    highlight={(item as { highlight?: boolean }).highlight}
                    active={activeNav === item.id}
                    onMouseEnter={item.type === 'link' ? () => handleNavEnter(item.id) : undefined}
                    onMouseLeave={item.type === 'link' ? handleNavLeave : undefined}
                  >
                    {item.label}
                    {item.hasChevron && (
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeNav === item.id ? 'rotate-180' : ''}`} />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Mega Menu: Shop By Categories */}
          <div
            className={`absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden z-50 ${
              activeNav === 'shop-by-categories' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
            onMouseEnter={() => handleNavEnter('shop-by-categories')}
            onMouseLeave={handleNavLeave}
          >
            <div className="mx-auto max-w-7xl px-4 py-8">
              <div className="flex gap-8">
                <div className="w-56 flex-shrink-0 border-r border-gray-100 pr-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        hoveredCategory === cat.slug
                          ? 'bg-brand-blue text-white'
                          : 'text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue'
                      }`}
                      onMouseEnter={() => setHoveredCategory(cat.slug)}
                    >
                      {cat.name}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-4">
                    {activeCat && (
                      <Link href={`/products?category=${encodeURIComponent(activeCat.name)}`} className="group block">
                        <div className="aspect-square rounded-xl overflow-hidden bg-brand-blue-light mb-2">
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-brand-blue text-lg font-semibold">All {activeCat.name}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-brand-blue transition-colors">Shop All</p>
                      </Link>
                    )}
                    {activeCat?.subcategories.map((sub) => {
                      const matchProduct = categoryProducts.find(
                        (p) => p.subcategory?.toLowerCase() === sub.name.toLowerCase()
                      );
                      return (
                        <Link key={sub.slug} href={`/products?category=${encodeURIComponent(activeCat.name)}`} className="group block">
                          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                            <img
                              src={matchProduct?.image || `https://picsum.photos/seed/${sub.slug}/300/300`}
                              alt={sub.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-800 group-hover:text-brand-blue transition-colors">{sub.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdown: New Arrivals */}
          <DropdownPanel
            columns={newArrivalsDropdown.columns}
            promo={newArrivalsDropdown.promo}
            active={activeNav === 'new-arrivals'}
            onMouseEnter={() => handleNavEnter('new-arrivals')}
            onMouseLeave={handleNavLeave}
          />

          {/* Dropdown: Collections */}
          <DropdownPanel
            columns={collectionsDropdown.columns}
            promo={collectionsDropdown.promo}
            active={activeNav === 'collections'}
            onMouseEnter={() => handleNavEnter('collections')}
            onMouseLeave={handleNavLeave}
          />
        </nav>
      </header>

      {/* ── Mobile Sidebar (slides from left, full height) ── */}
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Sidebar panel */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-400 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-brand-blue">kole</span>
              <span className="text-gray-800"> tex</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar search */}
        <form onSubmit={handleSearch} className="px-5 py-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-brand-blue"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Sidebar nav */}
        <div className="px-3 pb-6 space-y-0.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue"
          >
            Home
          </Link>

          {/* Accordion categories */}
          {categories.map((cat) => (
            <div key={cat.slug}>
              <button
                onClick={() => toggleMobileAccordion(cat.slug)}
                className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue transition-colors cursor-pointer"
              >
                {cat.name}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                    mobileAccordion === cat.slug ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: mobileAccordion === cat.slug ? (cat.subcategories.length + 1) * 44 : 0,
                  opacity: mobileAccordion === cat.slug ? 1 : 0,
                }}
              >
                <div className="pl-4 pb-1">
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-brand-blue hover:bg-brand-blue-light"
                  >
                    Shop All
                  </Link>
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-2.5 text-sm text-gray-500 hover:bg-brand-blue-light hover:text-brand-blue"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-4 py-3 text-sm font-bold text-yellow-600 hover:bg-yellow-50"
          >
            ON SALE
          </Link>

          <div className="mx-4 mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-3 text-gray-400">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="X"><XIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="TikTok"><TikTokIcon /></a>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
