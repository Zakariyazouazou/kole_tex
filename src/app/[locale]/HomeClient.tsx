'use client';

import { useTranslations } from 'next-intl';
import { Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { HeroBanners } from '@/components/home/HeroBanners';
import { CategoryExplorer } from '@/components/home/CategoryExplorer';
import { ShopByCampaign } from '@/components/home/ShopByCampaign';
import { FlashSaleBanner } from '@/components/home/FlashSaleBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ProductSlider } from '@/components/home/ProductSlider';
import Edition from '@/components/home/Edition';
import DualSlider from '@/components/home/DualSlider';

export function HomeClient() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const testimonials = [
    { text: t('testimonial1'), author: t('testimonial1Author'), role: t('testimonial1Role') },
    { text: t('testimonial2'), author: t('testimonial2Author'), role: t('testimonial2Role') },
    { text: t('testimonial3'), author: t('testimonial3Author'), role: t('testimonial3Role') },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Banners Section */}
      <HeroBanners />

      {/* 2. Categories Section */}
      <CategoryExplorer />

      {/* 3. Flash Sale Countdown */}
      <FlashSaleBanner />

      {/* 4. Featured Products (Grid) */}
      <FeaturedProducts />

      {/* 5. Product Slider (New High-End Slider) */}
      <ProductSlider />

      {/* 6. Shop By Campaign Section */}
      <ShopByCampaign />

      {/* 7. Edition Section */}
      <Edition />

      {/* 8. Dual Slider Section */}
      <DualSlider />

      {/* 6. Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('testimonials')}</h2>
            <p className="mt-2 text-gray-500">{t('testimonialsSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &quot;{test.text}&quot;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue font-bold text-sm">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{test.author}</p>
                    <p className="text-xs text-gray-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="py-16 bg-brand-blue">
        <div className="mx-auto max-w-[1440px] px-4 text-center">
          <Mail className="h-10 w-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">{t('newsletter')}</h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto">{t('newsletterSubtitle')}</p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              setEmail('');
            }}
          >
            {subscribed ? (
              <p className="text-white font-medium py-3">✓ Thank you for subscribing!</p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 rounded-full px-5 py-3 text-sm outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="bg-white text-brand-blue hover:bg-gray-100 rounded-full px-8 py-3 font-semibold cursor-pointer"
                >
                  {t('subscribe')}
                </Button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
