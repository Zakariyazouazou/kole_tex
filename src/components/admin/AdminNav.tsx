'use client';

import { Link, usePathname } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MapPin,
  ShoppingCart,
  Star,
  Package,
  Tag,
  RefreshCw,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Quotes', href: '/admin/quotes', icon: FileText },
  // { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Addresses', href: '/admin/addresses', icon: MapPin },
  { label: 'Carts', href: '/admin/carts', icon: ShoppingCart },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Toptex Sync', href: '/admin/sync', icon: RefreshCw },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href as never}
            className={cn(
              'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all group',
              active
                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-slate-800'
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon
                className={cn(
                  'h-5 w-5',
                  active ? 'text-white' : 'text-gray-400 group-hover:text-slate-800'
                )}
              />
              {item.label}
            </span>
            {active && <ChevronRight className="h-4 w-4" />}
          </Link>
        );
      })}
    </nav>
  );
}
