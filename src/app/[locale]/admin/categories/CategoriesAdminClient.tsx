'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ChevronRight, ChevronDown, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminCategory } from '@/lib/admin-api';

// Mock data — replace with real API: getCategories()
const MOCK_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    children: [
      { id: 'cat-1-1', name: 'Short Sleeve', parentId: 'cat-1' },
      { id: 'cat-1-2', name: 'Long Sleeve', parentId: 'cat-1' },
      { id: 'cat-1-3', name: 'Oversized', parentId: 'cat-1' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Polo Shirts',
    children: [
      { id: 'cat-2-1', name: 'Classic Polo', parentId: 'cat-2' },
      { id: 'cat-2-2', name: 'Sport Polo', parentId: 'cat-2' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Sweatshirts & Hoodies',
    children: [
      { id: 'cat-3-1', name: 'Hoodies', parentId: 'cat-3' },
      { id: 'cat-3-2', name: 'Crewneck', parentId: 'cat-3' },
      { id: 'cat-3-3', name: 'Zip-up', parentId: 'cat-3' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Jackets & Outerwear',
    children: [
      { id: 'cat-4-1', name: 'Fleece', parentId: 'cat-4' },
      { id: 'cat-4-2', name: 'Softshell', parentId: 'cat-4' },
    ],
  },
  { id: 'cat-5', name: 'Bags & Accessories' },
  { id: 'cat-6', name: 'Headwear' },
];

function CategoryNode({ category, depth = 0 }: { category: AdminCategory; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg transition-colors text-sm',
          hasChildren ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default',
          depth === 0 ? 'font-semibold text-gray-800' : 'text-gray-600 font-normal'
        )}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <Tag className={cn('h-3.5 w-3.5 shrink-0', depth === 0 ? 'text-slate-700' : 'text-gray-400')} />
        {category.name}
        {hasChildren && (
          <span className="ml-auto text-xs text-gray-400 font-normal">{category.children!.length}</span>
        )}
      </button>
      {hasChildren && open && (
        <div className="border-l border-gray-100 ml-4">
          {category.children!.map((child) => (
            <CategoryNode key={child.id} category={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesAdminClient() {
  const total = MOCK_CATEGORIES.reduce((acc, cat) => acc + 1 + (cat.children?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Read-only — managed through Toptex sync"
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs text-gray-400 mb-4">{total} total categories</p>
        <div className="space-y-1">
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryNode key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
