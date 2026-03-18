'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';

export function CategoryExplorer() {
  const t = useTranslations('home');

  const categories = [
    { name: t('categories.jackets'), img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: t('categories.socks'), img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: t('categories.hats'), img: 'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: t('categories.hoodies'), img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: t('categories.sweaters'), img: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: t('categories.shorts'), img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400&h=400&auto=format&fit=crop' },
  ];

  return (
    <section className="py-5 lg:py-12  bg-white">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 -mx-4 px-4 touch-pan-x [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={`/products`}
              className="flex-none w-[180px] lg:w-[220px] group border border-gray-100 rounded-none overflow-hidden transition-all hover:shadow-xl hover:border-gray-200"
            >
              <div className="aspect-square overflow-hidden bg-gray-50 rounded-none">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex items-center justify-between bg-white border-t border-gray-50">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter">
                  {cat.name}
                </span>
                <CustomButton 
                  className="h-8 w-8 p-0! flex items-center justify-center rounded-full border border-gray-100 group-hover:border-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </CustomButton>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
