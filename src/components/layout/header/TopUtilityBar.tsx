'use client';

import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { FacebookIcon, XIcon, InstagramIcon, TikTokIcon } from '@/components/icons/SocialIcons';

interface TopUtilityBarProps {
  scrolled: boolean;
}

export function TopUtilityBar({ scrolled }: TopUtilityBarProps) {
  return (
    <div
      className={`bg-brand-blue text-white text-xs transition-all duration-400 ease-in-out ${scrolled ? 'overflow-hidden' : 'overflow-visible'}`}
      style={{ maxHeight: scrolled ? 0 : 50, opacity: scrolled ? 0 : 1 }}
    >

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-2">
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="hover:text-white/80 transition-colors">Help Center</a>
            <Link href="/contact" className="hover:text-white/80 transition-colors">Contact</Link>
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs md:text-sm">Free Express Shipping on orders $120!</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher variant="light" />
            <div className="flex items-center gap-3 ml-2">
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="X"><XIcon /></a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="TikTok"><TikTokIcon /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
