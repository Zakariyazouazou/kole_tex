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
          {/* Column 1: Brand + Newsletter */}
          <div className="space-y-4">
            <Link href="/">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-brand-blue">kole</span>
                <span className="text-white"> tex</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">{t('about')}</p>
            <div className="pt-2">
              <p className="text-sm font-semibold text-white mb-2">{t('newsletter')}</p>
              <p className="text-xs text-gray-400 mb-3">{t('newsletterText')}</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand-blue transition-colors"
                />
                <CustomButton
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white border-brand-blue bg-brand-blue"
                  bgHover="#2d3a7a"
                >
                  {t('subscribe')}
                </CustomButton>

              </form>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {['home', 'products', 'about', 'pricing', 'contact'].map((key) => (
                <li key={key}>
                  <Link
                    href={key === 'home' ? '/' : `/${key}`}
                    className="text-sm text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {tn(key as 'home' | 'products' | 'about' | 'pricing' | 'contact')}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 hover:text-brand-blue transition-colors"
                >
                  {tn('login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('categories')}
            </h3>
            <ul className="space-y-2.5">
              {['Electronics', 'Clothing', 'Home & Kitchen', 'Sports'].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{t('phone')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{t('emailAddress')}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{t('address')}</span>
              </li>
            </ul>
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
            <span className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer">
              {t('privacyPolicy')}
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer">
              {t('termsOfService')}
            </span>
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </div>
    </footer>
  );
}
