'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { protectedApi } from '@/api';
import type { UserQuoteStats } from '@/types/quote.types';
import {
  FileText,
  Clock,
  CheckCircle,
  Coins,
  AlertTriangle,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function OverviewClient() {
  const t = useTranslations('dashboard');
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<UserQuoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    protectedApi
      .getMyQuoteStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          router.push('/login' as never);
          return;
        }
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const formatCurrency = (value: number) =>
    `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const cards = [
    {
      label: 'TOTAL QUOTES',
      value: error ? '—' : stats?.totalQuotes ?? 0,
      icon: FileText,
      color: 'text-brand-blue bg-brand-blue-light',
    },
    {
      label: 'PENDING',
      value: error ? '—' : stats?.pendingCount ?? 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'DELIVERED',
      value: error ? '—' : stats?.deliveredCount ?? 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'TOTAL SPENT',
      value: error ? '—' : formatCurrency(stats?.totalSpent ?? 0),
      icon: Coins,
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
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md hover:shadow-black/5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                {loading ? (
                  <div className="mt-1 h-8 w-16 animate-pulse rounded-md bg-gray-200" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
