'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  bgHover?: string;
  textHover?: string;
  className?: string;
}

export function CustomButton({
  children,
  bgHover = '#3C4EA1', // Fallback color
  textHover = 'white', // Fallback color
  className,
  ...props
}: CustomButtonProps) {
  const style = {
    '--bg-hover': bgHover,
    '--text-hover': textHover,
  } as React.CSSProperties;

  return (
    <button
      className={cn(
        // 'group' is required to trigger hover effects on child elements
        // Added 'border' and 'rounded-full' to match your input field shape
        'relative overflow-hidden px-6 py-3.5 text-sm font-medium border rounded-full group bg-transparent transition-all',
        className
      )}
      style={style}
      {...props}
    >
      {/* 
        TEXT LAYER: 
        z-10 keeps it above the animated background.
        group-hover changes the text color smoothly.
      */}
      <span className="relative z-10 block transition-colors duration-300 ease-in-out group-hover:text-(--text-hover)">
        {children}
      </span>

      {/* 
        BACKGROUND ANIMATION LAYER: 
        z-0 puts it behind the text.
        scale-x-0 hides it initially.
        origin-left makes it grow from left to right.
        group-hover:scale-x-100 fills the button on hover.
      */}
      <div className="absolute inset-0 z-0 h-full w-full bg-(--bg-hover) origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full" />
    </button>
  );
}