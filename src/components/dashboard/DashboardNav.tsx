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
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all group',
            item.active
              ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className={cn('h-5 w-5', item.active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
            {item.label}
          </div>
          {item.active && <ChevronRight className="h-4 w-4" />}
        </Link>
      ))}
    </nav>
  );
}
