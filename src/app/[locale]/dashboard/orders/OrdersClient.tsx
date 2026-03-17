'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function OrdersClient() {
  const t = useTranslations('dashboard');
  const { orders } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{t('orders')}</h1>
        <p className="text-sm text-gray-500">Manage and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-white">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">{t('noOrders')}</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">{t('noOrdersMessage')}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">{t('orderId')}</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">{t('date')}</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">{t('status')}</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-600">{t('total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-brand-blue">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${statusColors[order.status]} border-0 capitalize px-3 py-1 rounded-full text-[11px] font-bold`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
