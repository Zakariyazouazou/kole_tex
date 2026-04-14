'use client';

import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { NavLink } from './NavLink';
import type { Category } from '@/types/product.types';

// Old imports kept for reference (commented out):
// import { MegaMenu } from './MegaMenu';
// import { DropdownPanel } from './DropdownPanel';
// import { CategoriesDropdown } from './CategoriesDropdown';
// import { navMenuItems, newArrivalsDropdown, collectionsDropdown } from '@/lib/navigation-data';

interface DesktopNavigationProps {
  scrolled: boolean;
  desktopNavOpen: boolean;
  activeNav: string | null;
  hoveredCategory: string;
  setHoveredCategory: (val: string) => void;
  handleNavEnter: (id: string) => void;
  handleNavLeave: () => void;
  apiCategories: Category[];
}

export function DesktopNavigation({
  scrolled,
  desktopNavOpen,
  activeNav,
  handleNavEnter,
  handleNavLeave,
  apiCategories,
}: DesktopNavigationProps) {
  const activeCategory = apiCategories.find((c) => c.slug === activeNav);
  const hasSubcategories = !!(activeCategory && activeCategory.subcategories.length > 0);

  return (
    <>
      {/* Row 3 nav bar — API categories, desktop max 8 */}
      <nav
        className="hidden lg:block bg-brand-blue overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: !scrolled || desktopNavOpen ? 200 : 0,
          opacity: !scrolled || desktopNavOpen ? 1 : 0,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-1">
          <ul className="flex items-center">
            {apiCategories.map((category) => (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => handleNavEnter(category.slug)}
                onMouseLeave={handleNavLeave}
              >
                <NavLink
                  href={`/products?categorySlug=${category.slug}`}
                  active={activeNav === category.slug}
                >
                  {category.name}
                  {category.subcategories.length > 0 && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        activeNav === category.slug ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </NavLink>
              </li>
            ))}
            {/* Old nav items (Shop By Categories, New Arrivals, Collections, Accessories, ON SALE)
                are commented out in navigation-data.ts — not removed */}
          </ul>
        </div>
      </nav>

      {/* Subcategory dropdown — outside nav to avoid overflow-hidden clipping */}
      <div
        className={`absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden z-10 ${
          hasSubcategories
            ? 'max-h-45 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => activeNav && handleNavEnter(activeNav)}
        onMouseLeave={handleNavLeave}
      >
        {activeCategory && hasSubcategories && (
          <div className="mx-auto max-w-7xl px-4 py-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {activeCategory.name}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {activeCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/products?categorySlug=${activeCategory.slug}&subCategorySlug=${sub.slug}`}
                  className="text-sm text-gray-700 hover:text-brand-blue transition-colors whitespace-nowrap"
                  onClick={handleNavLeave}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Old dropdown panels (MegaMenu, DropdownPanel × 2, CategoriesDropdown)
          are commented out — not removed */}
    </>
  );
}
