'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't clash aggressively with the initial page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'accept' | 'reject' | 'customize') => {
    if (choice === 'customize') {
      // Here you would typically open a settings modal.
      // For now, we'll just log or show a simple alert.
      console.log('Open cookie customize settings');
      return;
    }

    // Save preference and hide banner
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // Outer fixed container: positioned at the bottom, slight padding so it floats on desktop
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none flex justify-center">
      
      {/* 
        Inner Card: slide-up animation, rounded corners, shadow.
        pointer-events-auto re-enables clicking inside the banner.
      */}
      <div className="pointer-events-auto w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in slide-in-from-bottom-10 fade-in duration-500 ease-out">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-start md:items-center gap-4 flex-1">
          <div className="bg-brand-blue/10 p-3 rounded-full shrink-0 hidden sm:block">
            <Cookie className="h-6 w-6 text-brand-blue" />
          </div>
          <div className="space-y-1">
            <h3 className="text-gray-900 font-semibold text-base">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => handleConsent('customize')}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2.5 w-full sm:w-auto"
          >
            Customize
          </button>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleConsent('reject')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
            >
              Reject All
            </button>
            <button
              onClick={() => handleConsent('accept')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-brand-blue hover:bg-[#3C4EA1] text-white text-sm font-medium transition-all shadow-sm text-center"
            >
              Accept All
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}