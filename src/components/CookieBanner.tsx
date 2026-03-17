'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';

type CookiePreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);

    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        // if (!consent) {
        //   const timer = setTimeout(() => setIsVisible(true), 1000);
        //   return () => clearTimeout(timer);
        // }

        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const savePreferences = (choice: 'accept-all' | 'reject-all' | 'custom', customPrefs?: CookiePreferences) => {
        let finalPreferences: CookiePreferences;

        if (choice === 'accept-all') {
            finalPreferences = { necessary: true, analytics: true, marketing: true };
        } else if (choice === 'reject-all') {
            finalPreferences = { necessary: true, analytics: false, marketing: false };
        } else {
            finalPreferences = customPrefs || preferences;
        }

        localStorage.setItem('cookie-consent', JSON.stringify(finalPreferences));
        setIsVisible(false);
        setShowCustomize(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* 
        MAIN BANNER - Full Width Edge-to-Edge at the bottom
      */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] animate-in slide-in-from-bottom duration-500 ease-out">
                {/* Inner Container: Keeps content from stretching too wide on large screens */}
                <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 lg:gap-8">

                    {/* Left Side: Icon & Text */}
                    <div className="flex items-start gap-4 flex-1 w-full">
                        <div className="bg-gray-800 p-2.5 rounded-full shrink-0 hidden sm:block mt-1">
                            <Cookie className="h-6 w-6 text-brand-blue" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-white font-semibold text-base">
                                We value your privacy
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400 max-w-3xl">
                                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                        <button
                            onClick={() => setShowCustomize(true)}
                            className="cursor-pointer w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-700 hover:bg-gray-800 text-white text-sm font-medium transition-all text-center whitespace-nowrap"
                        >
                            Customize
                        </button>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => savePreferences('reject-all')}
                                className="cursor-pointer w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-700 hover:bg-gray-800 text-white text-sm font-medium transition-all text-center whitespace-nowrap"
                            >
                                Reject All
                            </button>
                            <button
                                onClick={() => savePreferences('accept-all')}
                                className="cursor-pointer w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-blue hover:bg-[#3C4EA1] text-white text-sm font-medium transition-all shadow-sm text-center whitespace-nowrap"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 
        CUSTOMIZE MODAL - Responsive centered popup
      */}
            {showCustomize && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable on small screens */}
                        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
                            {/* Strictly Necessary */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Strictly Necessary</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">These cookies are essential for the website to function and cannot be switched off.</p>
                                </div>
                                <div className="flex items-center h-5 mt-0.5 shrink-0">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">Always On</span>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Analytics Cookies</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Help us understand how visitors interact with our website by collecting reporting information anonymously.</p>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={preferences.analytics}
                                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-1 ${preferences.analytics ? 'bg-brand-blue' : 'bg-gray-200'
                                        }`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Marketing Cookies</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Used to track visitors across websites to display relevant and engaging advertisements.</p>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={preferences.marketing}
                                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-1 ${preferences.marketing ? 'bg-brand-blue' : 'bg-gray-200'
                                        }`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 shrink-0">
                            <button
                                onClick={() => savePreferences('custom')}
                                className="w-full sm:flex-1 px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-white text-sm font-medium transition-all"
                            >
                                Save Preferences
                            </button>
                            <button
                                onClick={() => savePreferences('accept-all')}
                                className="w-full sm:flex-1 px-5 py-2.5 rounded-full bg-brand-blue hover:bg-[#3C4EA1] text-white text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <Check className="h-4 w-4" />
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}