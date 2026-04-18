import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { redirect } from 'next/navigation';
import "../globals.css";

import { routing } from '@/i18n/routing';
import { Bricolage_Grotesque } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import { GoogleProvider } from '@/components/GoogleProvider';

const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) redirect('/');
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={bricolage.variable}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GoogleProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </GoogleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
