'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { publicApi } from '@/api';
import type { Category } from '@/types/product.types';
import { ChevronDown, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryNavProps {
  selectedCategory?: string;
  selectedSubCategory?: string;
  onCategorySelect: (categorySlug?: string) => void;
  onSubCategorySelect: (subCategorySlug?: string) => void;
}

export function CategoryNav({
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
}: CategoryNavProps) {
  const locale = useLocale();
  const lang = locale as 'en' | 'fr' | 'de';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(selectedCategory || null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await publicApi.getCategories(lang);
        setCategories(data);
        if (!selectedCategory && data.length > 0) {
          setOpenCategory(data[0].slug);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [lang, selectedCategory]);

  if (loading) {
    return (
      <div className="hidden lg:flex items-center justify-center h-16 bg-white border-b border-gray-100">
        <Loader className="h-4 w-4 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const activeCat = categories.find((c) => c.slug === openCategory);

  return (
    <div className="hidden lg:block sticky top-22 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex items-center gap-4 overflow-x-auto py-3 -mx-4 px-4 scrollbar-hide">
          {/* Categories */}
          {categories.map((category) => (
            <div key={category.id} className="relative group shrink-0">
              <button
                onClick={() => {
                  setOpenCategory(openCategory === category.slug ? null : category.slug);
                  onCategorySelect(category.slug);
                  onSubCategorySelect(undefined);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.slug
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {category.name}
                {category.subcategories.length > 0 && (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Subcategories Dropdown */}
              {category.subcategories.length > 0 && selectedCategory === category.slug && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSubCategorySelect(sub.slug);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                        selectedSubCategory === sub.slug
                          ? 'bg-brand-blue/10 text-brand-blue font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Clear button */}
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onCategorySelect(undefined);
                onSubCategorySelect(undefined);
                setOpenCategory(null);
              }}
              className="ml-2 shrink-0 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
