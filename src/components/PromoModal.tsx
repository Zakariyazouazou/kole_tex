'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomButton } from './ui/CustomButton';

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after 3 seconds
    const timer = setTimeout(() => {
      const hasShown = localStorage.getItem('promo-modal-shown');
      // if (!hasShown) {
      //   setIsOpen(true);
      // }
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('promo-modal-shown', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center space-y-5">
          <div className="bg-brand-blue-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl">🎁</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Wanna 20% Off?</h2>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              Join our community today and get a special discount on your first purchase!
            </p>
          </div>
          
          <div className="pt-2 space-y-3">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-6 py-3.5 rounded-full border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
            />
            <CustomButton className="w-full text-brand-blue border-brand-blue" bgHover="#3C4EA1" textHover="white">
              Claim My Discount
            </CustomButton>
          </div>
          
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            No spam, just pure goodness.
          </p>
        </div>
      </div>
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={closeModal} />
    </div>
  );
}
