'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Send, Eye, ExternalLink } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '@/lib/admin-api';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusBadge: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

// Mock data — replace with real API: getAllOrders(page, limit, status, userId)
const MOCK_ORDERS: AdminOrder[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ord-${String(i + 1).padStart(4, '0')}`,
  user: {
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    firstName: ['Alice', 'Bob', 'Carol', 'Dan', 'Eva'][i % 5],
    lastName: ['Martin', 'Smith', 'White', 'Brown', 'Green'][i % 5],
  },
  status: ALL_STATUSES[i % ALL_STATUSES.length],
  totalPrice: parseFloat((Math.random() * 400 + 20).toFixed(2)),
  isPaid: i % 3 !== 0,
  myOrderId: `MY-${1000 + i}`,
  toptexOrderId: i % 4 === 0 ? `TPT-${2000 + i}` : undefined,
  createdAt: new Date(2026, 0, i + 1).toISOString(),
}));

const PAGE_SIZE = 10;

export function OrdersAdminClient() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [filterUserId, setFilterUserId] = useState('');

  // Forward modal state
  const [forwardOrder, setForwardOrder] = useState<AdminOrder | null>(null);
  const [testMode, setTestMode] = useState(true);

  const filtered = MOCK_ORDERS.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (filterUserId && !o.user.id.includes(filterUserId)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    // TODO: call updateOrderStatus(orderId, status)
    console.log('Update order status:', orderId, status);
  };

  const handleForward = () => {
    // TODO: call forwardOrderToToptex(forwardOrder!.id, testMode)
    setForwardOrder(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders" description={`${MOCK_ORDERS.length} total orders`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Status</Label>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as OrderStatus | 'ALL'); setPage(1); }}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">User ID</Label>
          <Input
            className="h-9 text-sm w-44"
            placeholder="Filter by user ID"
            value={filterUserId}
            onChange={(e) => { setFilterUserId(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Order ID', 'Customer', 'Status', 'Total', 'Paid', 'My Order ID', 'Toptex ID', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 whitespace-nowrap">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={order.status}
                      onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                    >
                      <SelectTrigger className={`h-7 w-36 text-xs border-0 font-medium ${statusBadge[order.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">€{order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {order.isPaid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.myOrderId ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.toptexOrderId ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-gray-400 hover:text-slate-800 gap-1"
                        onClick={() => setForwardOrder(order)}
                      >
                        <Send className="h-3 w-3" />
                        Forward
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>Page {page} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(Math.max(totalPages, 1), p + 1))} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Forward to Toptex Modal */}
      <Dialog open={!!forwardOrder} onOpenChange={() => setForwardOrder(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Forward to Toptex</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            Forward order <span className="font-semibold">{forwardOrder?.id}</span> to Toptex fulfillment.
          </p>
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 cursor-pointer">
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="rounded"
              />
              Test Mode (Sandbox)
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setForwardOrder(null)}>Cancel</Button>
            <Button className="bg-slate-800 hover:bg-slate-900 text-white gap-2" onClick={handleForward}>
              <Send className="h-4 w-4" />
              {testMode ? 'Forward (Sandbox)' : 'Forward (Production)'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
