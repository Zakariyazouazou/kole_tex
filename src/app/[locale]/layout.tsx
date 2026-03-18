import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';

import { routing } from '@/i18n/routing';
import { Bricolage_Grotesque } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PromoModal } from '@/components/PromoModal';
import { CookieBanner } from '@/components/CookieBanner';



const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={bricolage.variable}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
                <Footer />
                <ScrollToTop />
                {/* <PromoModal />
                <CookieBanner /> */}
              </div>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
