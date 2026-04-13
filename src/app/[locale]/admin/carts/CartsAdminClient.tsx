'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminCart, AdminCartDetail } from '@/lib/admin-api';

// Mock data — replace with real API: getAllCarts(page, limit)
const MOCK_CARTS: AdminCart[] = Array.from({ length: 15 }, (_, i) => ({
  cartId: `cart-${i + 1}`,
  user: {
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    firstName: ['Alice', 'Bob', 'Carol', 'Dan', 'Eva'][i % 5],
    lastName: ['Martin', 'Smith', 'White', 'Brown', 'Green'][i % 5],
  },
  itemCount: Math.floor(Math.random() * 5) + 1,
  totalValue: parseFloat((Math.random() * 300 + 10).toFixed(2)),
}));

const MOCK_CART_DETAILS: AdminCartDetail = {
  cartId: 'cart-1',
  user: { id: 'user-1', email: 'user1@example.com', firstName: 'Alice', lastName: 'Martin' },
  itemCount: 3,
  totalValue: 179.97,
  items: [
    { sku: 'SKU-001-RED-L', productName: 'Classic T-Shirt', quantity: 2, unitPrice: 29.99 },
    { sku: 'SKU-045-BLK-M', productName: 'Sport Polo', quantity: 1, unitPrice: 49.99 },
    { sku: 'SKU-123-WHT-XL', productName: 'Hoodie Pro', quantity: 1, unitPrice: 69.99 },
  ],
};

const PAGE_SIZE = 10;

export function CartsAdminClient() {
  const [page, setPage] = useState(1);
  const [detailCart, setDetailCart] = useState<AdminCartDetail | null>(null);

  const totalPages = Math.ceil(MOCK_CARTS.length / PAGE_SIZE);
  const paginated = MOCK_CARTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const viewDetail = () => {
    // TODO: call getUserCart(cart.user.id) and set result
    setDetailCart(MOCK_CART_DETAILS);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Carts" description={`${MOCK_CARTS.length} active carts`} />

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Cart ID', 'Customer', 'Items', 'Total Value', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((cart) => (
                <tr key={cart.cartId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{cart.cartId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 whitespace-nowrap">
                      {cart.user.firstName} {cart.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{cart.user.email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cart.itemCount}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">€{cart.totalValue.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={viewDetail}
                      className="h-7 px-2 text-xs text-gray-400 hover:text-slate-800 gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Detail Modal */}
      <Dialog open={!!detailCart} onOpenChange={() => setDetailCart(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cart Detail — {detailCart?.user.firstName} {detailCart?.user.lastName}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {detailCart?.items.map((item) => (
                  <tr key={item.sku}>
                    <td className="py-2 font-mono text-xs text-gray-400">{item.sku}</td>
                    <td className="py-2 text-gray-700">{item.productName}</td>
                    <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-700">€{item.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-semibold text-gray-900">
              <span>Total</span>
              <span>€{detailCart?.totalValue.toFixed(2)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
