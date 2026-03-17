'use client';

import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';

interface MegaMenuProps {
  activeNav: string | null;
  hoveredCategory: string;
  setHoveredCategory: (val: string) => void;
  handleNavEnter: (id: string) => void;
  handleNavLeave: () => void;
}

export function MegaMenu({
  activeNav,
  hoveredCategory,
  setHoveredCategory,
  handleNavEnter,
  handleNavLeave,
}: MegaMenuProps) {
  const activeCat = categories.find((c) => c.slug === hoveredCategory);
  const categoryProducts = activeCat ? getProductsByCategory(activeCat.name).slice(0, 8) : [];

  return (
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
  );
}
