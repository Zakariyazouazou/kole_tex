'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
};

const localeFlags: Record<string, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
};

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
  align?: 'left' | 'right';
  direction?: 'up' | 'down';
}

export function LanguageSwitcher({ 
  variant = 'dark', 
  align = 'right',
  direction = 'down' 
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';
    router.push(newPath as never);
    setOpen(false);
  };

  const textColor =
    variant === 'light'
      ? 'text-white hover:text-white/80'
      : 'text-gray-700 hover:text-brand-blue';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${textColor} cursor-pointer`}
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        } w-40 rounded-lg border border-gray-100 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-${direction === 'up' ? 'bottom' : 'top'}-2 duration-200`}>
          {Object.entries(localeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-brand-blue-light cursor-pointer ${
                code === locale
                  ? 'text-brand-blue font-semibold bg-brand-blue-light'
                  : 'text-gray-700'
              }`}
            >
              <span>{localeFlags[code]}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
