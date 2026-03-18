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
import FeaturesBanner from '@/components/home/FeaturesBanner';
import TrustAndBrands from '@/components/home/TrustAndBrands';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';

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

      {/* 8. Features Banner */}
      <FeaturesBanner />

      {/* 9. Dual Slider Section */}
      <DualSlider />

      {/* 10. Trust and Brands Section */}
      <TrustAndBrands />

      {/* 11. Testimonials Slider */}
      <TestimonialsSlider />

    </div>
  );
}
