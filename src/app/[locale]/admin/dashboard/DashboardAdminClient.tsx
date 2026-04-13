'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ShoppingBag,
  ShoppingCart,
  CheckCircle,
  RefreshCw,
  Clock,
  Truck,
  XCircle,
  CreditCard,
} from 'lucide-react';

// Mock data — replace with real API calls to /admin/dashboard
const stats = {
  totalUsers: 1284,
  activeCartsCount: 47,
  latestSyncStatus: 'success' as const,
  ordersByStatus: {
    PENDING: 23,
    PAID: 58,
    PROCESSING: 31,
    SHIPPED: 19,
    DELIVERED: 412,
    CANCELLED: 14,
  },
  recentOrders: [
    { id: 'ord-001', user: { email: 'alice@example.com', firstName: 'Alice', lastName: 'Martin' }, status: 'PENDING' as const, totalPrice: 89.99, isPaid: false, createdAt: '2026-04-10T09:00:00Z' },
    { id: 'ord-002', user: { email: 'bob@example.com', firstName: 'Bob', lastName: 'Smith' }, status: 'PAID' as const, totalPrice: 149.5, isPaid: true, createdAt: '2026-04-10T10:30:00Z' },
    { id: 'ord-003', user: { email: 'carol@example.com', firstName: 'Carol', lastName: 'White' }, status: 'SHIPPED' as const, totalPrice: 210.0, isPaid: true, createdAt: '2026-04-09T14:00:00Z' },
    { id: 'ord-004', user: { email: 'dan@example.com', firstName: 'Dan', lastName: 'Brown' }, status: 'DELIVERED' as const, totalPrice: 55.0, isPaid: true, createdAt: '2026-04-08T08:00:00Z' },
    { id: 'ord-005', user: { email: 'eva@example.com', firstName: 'Eva', lastName: 'Green' }, status: 'PROCESSING' as const, totalPrice: 320.0, isPaid: true, createdAt: '2026-04-07T16:20:00Z' },
  ],
};

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const syncBadge: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export function DashboardAdminClient() {
  const totalOrders = Object.values(stats.ordersByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store's key metrics."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          label="Active Carts"
          value={stats.activeCartsCount}
          icon={<ShoppingCart className="h-5 w-5" />}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Last Sync"
          value={stats.latestSyncStatus ?? 'N/A'}
          icon={<RefreshCw className="h-5 w-5" />}
          color={
            stats.latestSyncStatus === 'success'
              ? 'bg-green-100 text-green-600'
              : stats.latestSyncStatus === 'running'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-red-100 text-red-600'
          }
        />
      </div>

      {/* Orders by Status */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(
            [
              { key: 'PENDING', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-700' },
              { key: 'PAID', icon: <CreditCard className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
              { key: 'PROCESSING', icon: <RefreshCw className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-700' },
              { key: 'SHIPPED', icon: <Truck className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
              { key: 'DELIVERED', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
              { key: 'CANCELLED', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
            ] as const
          ).map(({ key, icon, color }) => (
            <div key={key} className={`rounded-xl p-4 flex flex-col gap-2 ${color}`}>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                {icon}
                {key}
              </div>
              <span className="text-2xl font-bold">
                {stats.ordersByStatus[key as keyof typeof stats.ordersByStatus]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4 text-right">Total</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">{order.id}</td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-medium">
                    €{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
