'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';

export function HeroBanners() {
  const t = useTranslations('home');

  return (
    <section className="pt-6 pb-2 lg:pb-12">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 lg:min-h-[600px]">
          
          {/* LARGE PRIMARY BANNER (Left) */}
          <div className="md:col-span-6 lg:col-span-6 relative group overflow-hidden rounded-2xl bg-gray-100 min-h-[400px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&h=800&auto=format&fit=crop"
              alt="Main Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <span className="inline-block mb-3 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white">
                {t('heroPromoLabel')}
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                {t('heroPromoTitle')}
              </h1>
              <Link href="/products">
                <CustomButton 
                  className="w-fit bg-white text-gray-900 border-none px-8 py-3.5 shadow-xl hover:bg-gray-50 font-bold"
                >
                  {t('heroPromoCTA')}
                </CustomButton>
              </Link>
            </div>
          </div>

          {/* VERTICAL BANNER (Middle) */}
          <div className="md:col-span-3 lg:col-span-3 relative group overflow-hidden rounded-2xl bg-gray-100 min-h-[400px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=600&h=800&auto=format&fit=crop"
              alt="Accessories"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5" />
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-start text-center pt-12">
               <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white mb-2">
                {t('heroVerticalLabel')}
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
                {t('heroVerticalTitle')}
              </h3>
              <Link href="/products?category=Accessories">
                <CustomButton 
                  className="bg-white text-gray-900 border-none px-8 py-3.5 shadow-xl hover:bg-gray-50 font-bold"
                >
                  {t('heroVerticalCTA')}
                </CustomButton>
              </Link>
            </div>
          </div>

          {/* STACKED BANNERS (Right) */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-4 lg:gap-6">
            {/* SMALL TOP */}
            <div className="relative group flex-1 min-h-[220px] rounded-2xl overflow-hidden bg-[#A18A78]">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&h=400&auto=format&fit=crop"
                alt="Promo Top"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 p-6 flex flex-col items-start justify-start pt-8">
                <h4 className="text-xl font-bold text-white mb-1 leading-tight">{t('heroSmall1Title')}</h4>
                <p className="text-white/90 text-sm font-medium mb-4">{t('heroSmall1Subtitle')}</p>
                <Link href="/products">
                  <CustomButton 
                    className="bg-white text-gray-900 border-none px-5 py-2.5 shadow-lg hover:bg-gray-50 text-xs font-bold"
                  >
                    {t('shop')}
                  </CustomButton>
                </Link>
              </div>
            </div>

            {/* SMALL BOTTOM */}
            <div className="relative group flex-1 min-h-[220px] rounded-2xl overflow-hidden bg-[#7B8B84]">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&h=400&auto=format&fit=crop"
                alt="Promo Bottom"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              />
              <img 
                src="https://static.vecteezy.com/system/resources/previews/016/592/766/original/socks-clothing-isolated-on-white-background-free-png.png" 
                alt="Socks Product"
                className="absolute right-0 bottom-0 w-1/2 h-auto object-contain transition-transform duration-500 group-hover:scale-110 translate-y-4"
              />
              <div className="absolute inset-0 p-6 flex flex-col items-start justify-start pt-8">
                <h4 className="text-xl font-bold text-white mb-1 leading-tight">{t('heroSmall2Title')}</h4>
                <p className="text-white/90 text-sm font-medium mb-4">{t('heroSmall2Subtitle')}</p>
                <Link href="/products">
                  <CustomButton 
                    className="bg-white text-gray-900 border-none px-5 py-2.5 shadow-lg hover:bg-gray-50 text-xs font-bold"
                  >
                    {t('shop')}
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
