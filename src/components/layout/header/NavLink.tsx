'use client';

import { Link } from '@/i18n/navigation';
import { useState } from 'react';

interface NavLinkProps {
  children: React.ReactNode;
  href?: string;
  highlight?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
}

export function NavLink({
  children,
  href,
  highlight,
  onMouseEnter,
  onMouseLeave,
  active,
}: NavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const showLine = active || hovered;

  const cls = `relative flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer ${
    highlight ? 'text-yellow-300 hover:text-yellow-200' : 'text-white hover:text-white/90'
  }`;

  const underline = (
    <span
      className="absolute bottom-2 left-5 right-5 h-[1.5px] bg-current transition-transform duration-250 ease-in-out origin-left"
      style={{ transform: showLine ? 'scaleX(1)' : 'scaleX(0)' }}
    />
  );

  const handlers = {
    onMouseEnter: () => { setHovered(true); onMouseEnter?.(); },
    onMouseLeave: () => { setHovered(false); onMouseLeave?.(); },
  };

  if (href) {
    return (
      <Link href={href} className={cls} {...handlers}>
        {children}
        {underline}
      </Link>
    );
  }
  return (
    <button className={cls} {...handlers}>
      {children}
      {underline}
    </button>
  );
}
