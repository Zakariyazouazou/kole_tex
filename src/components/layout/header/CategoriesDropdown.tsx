'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { publicApi } from '@/api';
import type { Category } from '@/types/product.types';

interface CategoriesDropdownProps {
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CategoriesDropdown({ active, onMouseEnter, onMouseLeave }: CategoriesDropdownProps) {
  const locale = useLocale();
  const lang = locale as 'en' | 'fr' | 'de';
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    publicApi.getCategories(lang).then(setCategories).catch(() => {});
  }, [lang]);

  if (categories.length === 0) return null;

  return (
    <div
      className={`absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden z-10 ${
        active ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {categories.map((category) => (
            <div key={category.id} className="w-[calc(25%-24px)] min-w-[160px]">
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                <Link
                  href={`/products?categorySlug=${category.slug}`}
                  className="hover:text-brand-blue transition-colors"
                  onClick={onMouseLeave}
                >
                  {category.name}
                </Link>
              </h4>
              {category.subcategories.length > 0 ? (
                <ul className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/products?categorySlug=${category.slug}&subCategorySlug=${sub.slug}`}
                        className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
                        onClick={onMouseLeave}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  href={`/products?categorySlug=${category.slug}`}
                  className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
                  onClick={onMouseLeave}
                >
                  Shop All
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
