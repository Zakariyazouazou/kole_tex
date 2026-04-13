'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

// Mock data — replace with real API: getToptexOrders()
const mockToptexOrders = [
  { id: 'TPT-2000', orderId: 'ord-0001', status: 'PROCESSING', updatedAt: '2026-04-10T09:00:00Z' },
  { id: 'TPT-2004', orderId: 'ord-0005', status: 'SHIPPED', updatedAt: '2026-04-09T14:00:00Z' },
  { id: 'TPT-2008', orderId: 'ord-0009', status: 'DELIVERED', updatedAt: '2026-04-08T08:00:00Z' },
];

export function ToptexOrdersClient() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Toptex Orders" description="All orders forwarded to Toptex fulfillment" />

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Toptex ID', 'Our Order ID', 'Status', 'Last Update'].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockToptexOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.orderId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(o.updatedAt).toLocaleString()}
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
