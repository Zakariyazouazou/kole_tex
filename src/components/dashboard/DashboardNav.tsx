'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardNav() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  const navItems = [
    {
      label: t('overview'),
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: t('orders'),
      href: '/dashboard/orders',
      icon: Package,
      active: pathname.includes('/dashboard/orders'),
    },
    {
      label: t('accountSettings'),
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname.includes('/dashboard/settings'),
    },
    {
      label: t('support'),
      href: '/dashboard/support',
      icon: HelpCircle,
      active: pathname.includes('/dashboard/support'),
    },
  ];

  return (
    <nav className="flex lg:flex-col items-center lg:items-stretch justify-between lg:justify-start w-full lg:space-y-1 bg-white lg:bg-transparent border-t lg:border-t-0 border-gray-100 lg:border-none px-4 md:px-6 py-2 lg:p-0">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex flex-col lg:flex-row items-center justify-center lg:justify-between px-1 md:px-4 py-2 lg:py-3 text-[10px] md:text-xs lg:text-sm font-medium rounded-xl transition-all group flex-1 lg:flex-none gap-1 lg:gap-3',
            item.active
              ? 'bg-brand-blue/5 lg:bg-brand-blue text-brand-blue lg:text-white lg:shadow-md lg:shadow-brand-blue/20'
              : 'text-gray-400 lg:text-gray-600 hover:text-brand-blue lg:hover:bg-gray-100'
          )}
        >
          <item.icon className={cn('h-5 w-5 md:h-6 md:w-6 lg:h-5 lg:w-5', item.active ? 'text-brand-blue lg:text-white' : 'text-gray-400 group-hover:text-brand-blue lg:group-hover:text-gray-600')} />
          <span className="truncate">{item.label}</span>
          {item.active && <ChevronRight className="hidden lg:block h-4 w-4" />}
        </Link>
      ))}
    </nav>
  );
}

