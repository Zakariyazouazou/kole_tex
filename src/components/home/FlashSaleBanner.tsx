'use client';

import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/ui/CustomButton';
import { Copy, Check } from 'lucide-react';

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 13,
    minutes: 22,
    seconds: 32,
    milliseconds: 56,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds, milliseconds } = prev;

        milliseconds -= 1;
        if (milliseconds < 0) {
          milliseconds = 99;
          seconds -= 1;
        }
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          // Reset for demo purposes or stop
          return { hours: 13, minutes: 22, seconds: 32, milliseconds: 56 };
        }

        return { hours, minutes, seconds, milliseconds };
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const handleCopy = () => {
    navigator.clipboard.writeText('FLASH30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="overflow-hidden">
      <div className="mx-auto py-6 mb-8 bg-gray-50 border-y border-gray-100 max-w-[1440px] px-4 flex flex-col md:flex-row items-center justify-between gap-6 rounded-md">
        
        {/* Label */}
        <div className="flex-none">
          <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
            The Last Chance
          </span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-4 text-gray-900">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black tabular-nums">{formatNumber(timeLeft.hours)}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Hours</span>
          </div>
          <span className="text-2xl font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black tabular-nums">{formatNumber(timeLeft.minutes)}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Minutes</span>
          </div>
          <span className="text-2xl font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-black tabular-nums">{formatNumber(timeLeft.seconds)}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Seconds</span>
          </div>
          <span className="text-2xl font-bold mb-4">:</span>
          <div className="flex flex-col items-center w-12 text-red-500">
            <span className="text-3xl md:text-4xl font-black tabular-nums">{formatNumber(timeLeft.milliseconds)}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Ms</span>
          </div>
        </div>

        {/* Promo Message */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-900 font-bold text-lg leading-tight uppercase tracking-tight">
            Extra <span className="text-brand-blue">30% OFF</span> ALL BEST SELLERS & TRENDING STYLE
          </p>
          <p className="text-gray-500 text-sm mt-0.5">Limited time only. Use code at checkout.</p>
        </div>

        {/* CTA Button */}
        <div className="flex-none">
          <CustomButton 
            onClick={handleCopy}
            className="bg-brand-blue text-white min-w-[180px] font-bold shadow-xl border-none"
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Code: FLASH30</span>
                </>
              )}
            </div>
          </CustomButton>
        </div>

      </div>
    </section>
  );
}
