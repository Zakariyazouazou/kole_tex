'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import { Link } from '@/i18n/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type {
  ActionQueueResponse,
  RevenueResponse,
  QuoteFunnelResponse,
  TopCustomersResponse,
} from '@/lib/admin-api';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  Minus,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtEur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days > 30) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className ?? ''}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

// ─── Inline section error ─────────────────────────────────────────────────────

function SectionError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

// ─── ACTION QUEUE ─────────────────────────────────────────────────────────────

type Urgency = 'ok' | 'warning' | 'danger';

interface ActionCardItem {
  id: string;
  totalPrice: string;
  date: string;
  user: { firstName: string; lastName: string; email: string };
}

const URGENCY_CARD: Record<Urgency, string> = {
  ok: 'bg-green-50 border-green-200',
  warning: 'bg-orange-50 border-orange-200',
  danger: 'bg-red-50 border-red-200',
};

const URGENCY_COUNT: Record<Urgency, string> = {
  ok: 'text-green-600',
  warning: 'text-orange-600',
  danger: 'text-red-600',
};

const URGENCY_ICON: Record<Urgency, string> = {
  ok: 'text-green-500',
  warning: 'text-orange-500',
  danger: 'text-red-500',
};

function ActionQueueCard({
  icon,
  count,
  message,
  items,
  urgency,
}: {
  icon: React.ReactNode;
  count: number;
  message: string;
  items: ActionCardItem[];
  urgency: Urgency;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${URGENCY_CARD[urgency]}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${URGENCY_ICON[urgency]}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-3xl font-black leading-none ${URGENCY_COUNT[urgency]}`}>{count}</p>
          <p className="text-xs font-medium mt-1.5 leading-relaxed text-gray-700">{message}</p>
        </div>
      </div>
      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-semibold underline underline-offset-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          {expanded ? 'Hide details ▲' : 'Show details ▼'}
        </button>
      )}
      {expanded && (
        <ul className="space-y-2 pt-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white/80 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {item.user.firstName} {item.user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{item.user.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-xs font-bold text-gray-800">
                  {fmtEur.format(parseFloat(item.totalPrice))}
                </p>
                <Link
                  href={`/admin/quotes/${item.id}`}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  View Quote →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionQueueSection({
  data,
  error,
}: {
  data: ActionQueueResponse | null;
  error: string | null;
}) {
  if (error) return <SectionError message={error} />;
  if (!data) return null;

  const cards: {
    key: string;
    icon: React.ReactNode;
    count: number;
    message: string;
    items: ActionCardItem[];
    urgency: Urgency;
  }[] = [
    {
      key: 'pendingQuotes',
      icon: <Clock className="h-5 w-5" />,
      count: data.pendingQuotes.count,
      message: data.pendingQuotes.message,
      items: [],
      urgency: data.pendingQuotes.count > 0 ? 'warning' : 'ok',
    },
    {
      key: 'confirmedUnpaid',
      icon: <CreditCard className="h-5 w-5" />,
      count: data.confirmedUnpaid.count,
      message: data.confirmedUnpaid.message,
      items: (data.confirmedUnpaid.items ?? []).map((it) => ({
        id: it.id,
        totalPrice: it.totalPrice,
        date: it.confirmedAt
          ? new Date(it.confirmedAt).toLocaleDateString()
          : new Date(it.createdAt).toLocaleDateString(),
        user: it.user,
      })),
      urgency: data.confirmedUnpaid.count > 0 ? 'warning' : 'ok',
    },
    {
      key: 'paidNotAdvanced',
      icon: <AlertTriangle className="h-5 w-5" />,
      count: data.paidNotAdvanced.count,
      message:
        data.paidNotAdvanced.message ??
        (data.paidNotAdvanced.count === 0 ? 'All paid quotes are being processed' : ''),
      items: (data.paidNotAdvanced.items ?? []).map((it) => ({
        id: it.id,
        totalPrice: it.totalPrice,
        date: it.paidAt ? new Date(it.paidAt).toLocaleDateString() : '—',
        user: it.user,
      })),
      urgency: data.paidNotAdvanced.count > 0 ? 'danger' : 'ok',
    },
    {
      key: 'stuckProcessing',
      icon: <AlertCircle className="h-5 w-5" />,
      count: data.stuckProcessing.count,
      message:
        data.stuckProcessing.message ??
        (data.stuckProcessing.count === 0 ? 'No stuck quotes' : ''),
      items: (data.stuckProcessing.items ?? []).map((it) => ({
        id: it.id,
        totalPrice: it.totalPrice,
        date: it.updatedAt ? new Date(it.updatedAt).toLocaleDateString() : '—',
        user: it.user,
      })),
      urgency: data.stuckProcessing.count > 0 ? 'danger' : 'ok',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <ActionQueueCard key={card.key} icon={card.icon} count={card.count} message={card.message} items={card.items} urgency={card.urgency} />
      ))}
    </div>
  );
}

// ─── REVENUE ──────────────────────────────────────────────────────────────────

function getISOWeek(d: Date): { iso: string; label: string } {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  const weekNo =
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  const year = date.getFullYear();
  return {
    iso: `${year}-W${String(weekNo).padStart(2, '0')}`,
    label: `W${String(weekNo).padStart(2, '0')}`,
  };
}

function buildWeeklyData(weeklyRevenue: { week: string; total: number }[]) {
  const now = new Date();
  const result: { label: string; iso: string; total: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const w = getISOWeek(d);
    const found = weeklyRevenue.find((wr) => wr.week === w.iso);
    result.push({ label: w.label, iso: w.iso, total: found?.total ?? 0 });
  }
  return result;
}

function WeeklyLineChart({
  weeks,
}: {
  weeks: { label: string; total: number }[];
}) {
  const maxRevenue = Math.max(...weeks.map((w) => w.total), 1);
  const W = 480;
  const H = 130;
  const PAD = { top: 12, right: 12, bottom: 28, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const xs = weeks.map((_, i) =>
    weeks.length > 1 ? PAD.left + (i / (weeks.length - 1)) * innerW : PAD.left + innerW / 2
  );
  const ys = weeks.map((w) => PAD.top + innerH - (w.total / maxRevenue) * innerH);

  const pathD = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(' ');

  const gridFracs = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Weekly revenue">
      {gridFracs.map((frac) => {
        const y = PAD.top + innerH - frac * innerH;
        return (
          <g key={frac}>
            <line
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
              {frac === 0 ? '€0' : `€${Math.round(frac * maxRevenue)}`}
            </text>
          </g>
        );
      })}
      <path
        d={`${pathD} L ${xs[xs.length - 1].toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${xs[0].toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`}
        fill="#1e293b"
        fillOpacity="0.07"
      />
      <path
        d={pathD}
        fill="none"
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {weeks.map((w, i) =>
        w.total > 0 ? (
          <circle key={i} cx={xs[i]} cy={ys[i]} r="3" fill="#1e293b" />
        ) : null
      )}
      {weeks.map((w, i) =>
        i % 2 === 0 ? (
          <text
            key={i}
            x={xs[i]}
            y={H - 6}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            {w.label}
          </text>
        ) : null
      )}
    </svg>
  );
}

function RevenueSection({
  data,
  error,
}: {
  data: RevenueResponse | null;
  error: string | null;
}) {
  if (error) return <SectionError message={error} />;
  if (!data) return null;

  const weeks = buildWeeklyData(data.weeklyRevenue);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Revenue</h2>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-gray-50 px-4 py-3 space-y-1">
          <p className="text-xs text-gray-400 font-medium">This Month</p>
          <p className="text-lg font-black text-gray-900 leading-tight">
            {fmtEur.format(data.thisMonth.total)}
          </p>
          <p className="text-xs text-gray-500">{data.thisMonth.count} quotes</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-4 py-3 space-y-1">
          <p className="text-xs text-gray-400 font-medium">Last Month</p>
          <p className="text-lg font-black text-gray-900 leading-tight">
            {fmtEur.format(data.lastMonth.total)}
          </p>
          <p className="text-xs text-gray-500">{data.lastMonth.count} quotes</p>
        </div>
        <div
          className={`rounded-xl px-4 py-3 space-y-1 ${
            data.trendPercent === null
              ? 'bg-gray-50'
              : data.trendPercent >= 0
              ? 'bg-green-50'
              : 'bg-red-50'
          }`}
        >
          <p className="text-xs text-gray-400 font-medium">Trend</p>
          {data.trendPercent === null ? (
            <p className="text-lg font-black text-gray-400 flex items-center gap-1 leading-tight">
              <Minus className="h-4 w-4" /> —
            </p>
          ) : data.trendPercent >= 0 ? (
            <p className="text-lg font-black text-green-700 flex items-center gap-1 leading-tight">
              <TrendingUp className="h-4 w-4" /> +{data.trendPercent}%
            </p>
          ) : (
            <p className="text-lg font-black text-red-700 flex items-center gap-1 leading-tight">
              <TrendingDown className="h-4 w-4" /> {data.trendPercent}%
            </p>
          )}
        </div>
      </div>

      <WeeklyLineChart weeks={weeks} />

      <p className="text-xs text-gray-400 text-center">
        Average quote value:{' '}
        <span className="font-semibold text-gray-700">
          {fmtEur.format(data.averageQuoteValue)}
        </span>
      </p>
    </div>
  );
}

// ─── QUOTE FUNNEL ─────────────────────────────────────────────────────────────

const FUNNEL_BAR_COLOR: Record<string, string> = {
  PENDING: 'bg-gray-400',
  CONFIRMED: 'bg-blue-500',
  PROCESSING: 'bg-orange-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

function QuoteFunnelSection({
  data,
  error,
}: {
  data: QuoteFunnelResponse | null;
  error: string | null;
}) {
  if (error) return <SectionError message={error} />;
  if (!data) return null;

  const maxCount = Math.max(...data.funnel.map((f) => f.count), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Quote Funnel</h2>

      <div className="space-y-3">
        {data.funnel.map((item) => {
          const pct = (item.count / maxCount) * 100;
          const barColor = FUNNEL_BAR_COLOR[item.status] ?? 'bg-gray-400';
          return (
            <div key={item.status} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-semibold text-gray-600 uppercase">
                {item.status}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.max(pct, item.count > 0 ? 2 : 0)}%` }}
                />
              </div>
              <span className="w-7 text-right text-xs font-bold text-gray-700">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
        <span className="rounded-full bg-orange-100 text-orange-700 px-4 py-1.5 text-xs font-semibold">
          Confirmed but unpaid: {data.highlights.confirmedUnpaid}
        </span>
        <span className="rounded-full bg-green-100 text-green-700 px-4 py-1.5 text-xs font-semibold">
          Total paid quotes: {data.highlights.totalPaid}
        </span>
      </div>
    </div>
  );
}

// ─── TOP CUSTOMERS ────────────────────────────────────────────────────────────

const RANK_STYLE: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-700 font-black',
  2: 'bg-gray-200 text-gray-600 font-black',
  3: 'bg-orange-100 text-orange-700 font-black',
};

function TopCustomersSection({
  data,
  error,
}: {
  data: TopCustomersResponse | null;
  error: string | null;
}) {
  if (error) return <SectionError message={error} />;
  if (!data || data.customers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Top Customers
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Rank', 'Name', 'Email', 'Total Paid', 'Quotes', 'Last Activity'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.customers.map((customer, idx) => {
              const rank = idx + 1;
              const badgeCls =
                RANK_STYLE[rank] ?? 'bg-gray-50 text-gray-500 font-semibold';
              return (
                <tr key={customer.userId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${badgeCls}`}
                    >
                      {rank}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    <Link
                      href={`/admin/users/${customer.userId}`}
                      className="hover:underline underline-offset-2"
                    >
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{customer.email}</td>
                  <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                    {fmtEur.format(customer.totalPaid)}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{customer.quoteCount}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {relativeTime(customer.lastQuoteAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardAdminClient() {
  const [loading, setLoading] = useState(true);
  const [actionQueue, setActionQueue] = useState<ActionQueueResponse | null>(null);
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [funnel, setFunnel] = useState<QuoteFunnelResponse | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomersResponse | null>(null);
  const [actionQueueError, setActionQueueError] = useState<string | null>(null);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [funnelError, setFunnelError] = useState<string | null>(null);
  const [topCustomersError, setTopCustomersError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi
        .getActionQueue()
        .then(setActionQueue)
        .catch((err: unknown) => setActionQueueError(extractApiError(err))),
      adminApi
        .getRevenue()
        .then(setRevenue)
        .catch((err: unknown) => setRevenueError(extractApiError(err))),
      adminApi
        .getQuoteFunnel()
        .then(setFunnel)
        .catch((err: unknown) => setFunnelError(extractApiError(err))),
      adminApi
        .getTopCustomers(10)
        .then(setTopCustomers)
        .catch((err: unknown) => setTopCustomersError(extractApiError(err))),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Analytics & action overview."
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* ACTION QUEUE */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Action Queue
            </h2>
            <ActionQueueSection data={actionQueue} error={actionQueueError} />
          </section>

          {/* REVENUE + FUNNEL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueSection data={revenue} error={revenueError} />
            <QuoteFunnelSection data={funnel} error={funnelError} />
          </div>

          {/* TOP CUSTOMERS */}
          <TopCustomersSection data={topCustomers} error={topCustomersError} />
        </>
      )}
    </div>
  );
}
