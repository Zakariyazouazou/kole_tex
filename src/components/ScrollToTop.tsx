'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${isDashboard ? 'bottom-28' : 'bottom-10'} right-2 lg:bottom-5 lg:right-5 z-40 p-3 rounded-full bg-brand-blue text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}