'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/products';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function HomeClient() {
  const t = useTranslations('home');
  const featured = getFeaturedProducts();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const features = [
    { icon: Truck, title: t('freeShipping'), desc: t('freeShippingDesc') },
    { icon: ShieldCheck, title: t('securePayment'), desc: t('securePaymentDesc') },
    { icon: RotateCcw, title: t('easyReturns'), desc: t('easyReturnsDesc') },
    { icon: Headphones, title: t('support247'), desc: t('support247Desc') },
  ];

  const testimonials = [
    { text: t('testimonial1'), author: t('testimonial1Author'), role: t('testimonial1Role') },
    { text: t('testimonial2'), author: t('testimonial2Author'), role: t('testimonial2Role') },
    { text: t('testimonial3'), author: t('testimonial3Author'), role: t('testimonial3Role') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue-light via-white to-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-6 text-base rounded-full cursor-pointer"
                >
                  {t('shopNow')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue-light px-8 py-6 text-base rounded-full cursor-pointer"
                >
                  {t('learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-brand-blue/20 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('featuredProducts')}</h2>
            <p className="mt-2 text-gray-500">{t('featuredSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue-light rounded-full px-8 cursor-pointer"
              >
                {t('viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
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

      {/* Newsletter */}
      <section className="py-16 bg-brand-blue">
        <div className="mx-auto max-w-7xl px-4 text-center">
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
