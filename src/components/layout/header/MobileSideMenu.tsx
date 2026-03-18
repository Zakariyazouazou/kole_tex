'use client';

import { Link } from '@/i18n/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { categories } from '@/lib/categories';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { FacebookIcon, XIcon, InstagramIcon, TikTokIcon } from '@/components/icons/SocialIcons';

interface MobileSideMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  mobileAccordion: string | null;
  toggleMobileAccordion: (slug: string) => void;
}

export function MobileSideMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  mobileAccordion,
  toggleMobileAccordion,
}: MobileSideMenuProps) {
  return (
    <>
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
        {/* Sidebar Header & Socials */}
        <div className="border-b border-gray-100 pb-2">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
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

          <div className="flex items-center justify-between px-5 py-2 gap-4">
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" aria-label="Facebook" className="hover:text-brand-blue transition-colors"><FacebookIcon /></a>
              <a href="#" aria-label="X" className="hover:text-brand-blue transition-colors"><XIcon /></a>
              <a href="#" aria-label="Instagram" className="hover:text-brand-blue transition-colors"><InstagramIcon /></a>
              <a href="#" aria-label="TikTok" className="hover:text-brand-blue transition-colors"><TikTokIcon /></a>
            </div>
            <LanguageSwitcher align="right" />
          </div>
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
                    href={`/products`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-brand-blue hover:bg-brand-blue-light"
                  >
                    Shop All
                  </Link>
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/products`}
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
        </div>
      </div>
    </>
  );
}

