'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { AdminProduct } from '@/lib/admin-api';

// Mock data — replace with real API: getAdminProducts(page, limit, search)
const MOCK_PRODUCTS: AdminProduct[] = Array.from({ length: 35 }, (_, i) => ({
  catalogReference: `REF-${String(i + 1).padStart(4, '0')}`,
  name: ['Classic T-Shirt', 'Sport Polo', 'Business Shirt', 'Hoodie Pro', 'Fleece Jacket'][i % 5] + ` (v${i + 1})`,
  brand: ['Gildan', 'Fruit of the Loom', 'Stanley/Stella', 'B&C', 'Sol\'s'][i % 5],
  category: ['T-Shirts', 'Polo', 'Shirts', 'Sweatshirts', 'Jackets'][i % 5],
  price: parseFloat((9.99 + i * 2.5).toFixed(2)),
  colors: [['Red', 'Blue', 'Black'], ['White', 'Navy'], ['Black', 'Grey', 'White']][i % 3],
  sizes: [['XS', 'S', 'M', 'L', 'XL'], ['S', 'M', 'L', 'XL', 'XXL']][i % 2],
}));

const PAGE_SIZE = 10;

export function ProductsAdminClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.catalogReference.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Read-only — products are managed through Toptex sync"
      />

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-9 h-9 text-sm"
          placeholder="Search name, reference, brand…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Reference', 'Name', 'Brand', 'Category', 'Price', 'Colors', 'Sizes'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((product) => (
                <tr key={product.catalogReference} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{product.catalogReference}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">€{product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((c) => (
                        <span key={c} className="inline-flex rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((s) => (
                        <span key={s} className="inline-flex rounded-full px-2 py-0.5 text-xs bg-blue-50 text-blue-600 font-medium">{s}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>{filtered.length} results — Page {page} of {totalPages || 1}</span>
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
    </div>
  );
}
