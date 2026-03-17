'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  DollarSign 
} from 'lucide-react';

export function OverviewClient() {
  const t = useTranslations('dashboard');
  const { user, orders } = useApp();

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  const stats = [
    {
      label: t('totalOrders'),
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-brand-blue bg-brand-blue-light',
    },
    {
      label: t('pending'),
      value: pending,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: t('delivered'),
      value: delivered,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: t('totalSpent'),
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}, {user?.name}! 👋
        </h1>
        <p className="text-sm text-gray-500">{t('overview')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md hover:shadow-black/5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
