'use client';

import { Link } from '@/i18n/navigation';
import { CustomButton } from '@/components/ui/CustomButton';


interface DropdownPanelProps {
  columns: { title: string; links: string[] }[];
  promo: { badge: string; title: string; image: string };
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DropdownPanel({
  columns,
  promo,
  active,
  onMouseEnter,
  onMouseLeave,
}: DropdownPanelProps) {
  return (
    <div
      className={`absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden z-10 ${
        active ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-6">
            {columns.map((col) => (
              <div key={col.title} className="w-[calc(25%-24px)] min-w-[160px]">
                <h4 className="text-sm font-bold text-gray-900 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="/products" className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="w-52 shrink-0">
            <div className="relative rounded-xl overflow-hidden h-full min-h-[250px]">
              <img src={promo.image} alt="Promo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex flex-col items-center justify-end p-5 text-center">
                <span className="text-xs font-semibold text-white/90 bg-brand-blue px-3 py-1 rounded-full mb-2">{promo.badge}</span>
                <p className="text-white text-base font-bold leading-tight mb-3">{promo.title}</p>
                <CustomButton 
                  className="bg-white text-gray-900 border-white hover:border-transparent text-xs py-2 px-4" 
                  bgHover="#3C4EA1" 
                  textHover="white"
                >
                  Shop Now
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
