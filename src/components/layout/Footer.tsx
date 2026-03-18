'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';

export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-brand-blue">kole</span>
                <span className="text-white"> tex</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Kole Tex is your premier destination for high-quality electronics, fashion, and home essentials. We strive for excellence in every product.
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 italic">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: tn('home'), href: '/' },
                { label: tn('products'), href: '/products' },
                { label: tn('about'), href: '/about' },
                // { label: tn('pricing'), href: '/pricing' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 italic">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'FAQ', href: '/faq' },
                { label: 'Support', href: '/support' },
                { label: 'Delivery', href: '/delivery' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 italic">
              {t('newsletter')}
            </h3>
            <p className="text-xs text-gray-400 mb-4">{t('newsletterText')}</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand-blue transition-all"
              />
              <CustomButton
                type="submit"
                className="w-full py-3 text-sm font-bold text-white border-brand-blue bg-brand-blue shadow-lg shadow-brand-blue/10"
                bgHover="#2d3a7a"
              >
                {t('subscribe')}
              </CustomButton>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} Kole Tex. {t('rights')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer">
              Terms & Conditions
            </Link>
            <LanguageSwitcher variant="light" direction="up" />
          </div>
        </div>
      </div>
    </footer>
  );
}
