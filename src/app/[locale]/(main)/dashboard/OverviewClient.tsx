'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function OverviewClient() {
  const t = useTranslations('dashboard');
  const { user } = useAuth();
  const { orders } = useOrders();

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

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
      {/* Email verification banner */}
      {user && !user.isEmailVerified && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
          <span className="flex-1">
            Your email address is not verified. Please verify it to access all features.
          </span>
          <Link
            href={`/verify-email?email=${encodeURIComponent(user.email)}` as never}
            className="shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600 transition-colors"
          >
            Verify Email
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}, {fullName}! 👋
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
