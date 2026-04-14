'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ProductFiltersResponse } from '@/types/product.types';
import type { ProductFilters } from '../hooks/useProducts';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FiltersSidebarProps {
  availableFilters: ProductFiltersResponse | null;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// --- Collapsible section wrapper ---
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-gray-800 hover:text-brand-blue transition-colors"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

// --- Multi-select autocomplete (Size & Brand) ---
interface MultiSelectOption { label: string; count: number; }
interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

function MultiSelectAutocomplete({ options, selected, onChange, placeholder = 'Search...' }: MultiSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  const toggle = (label: string) => {
    const next = selected.includes(label) ? selected.filter((s) => s !== label) : [...selected, label];
    onChange(next);
  };

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] font-medium px-2 py-0.5">
              {s}
              <button type="button" onClick={() => toggle(s)} aria-label={`Remove ${s}`} className="hover:text-brand-blue/60 leading-none">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 cursor-text hover:border-gray-300 transition-colors" onClick={() => setOpen(true)}>
        <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none min-w-0"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setQuery(''); }} className="text-gray-400 hover:text-gray-600">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.map((opt) => {
            const active = selected.includes(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); toggle(opt.label); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${active ? 'bg-brand-blue/5 text-brand-blue font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'}`}>
                    {active && (
                      <svg className="h-2 w-2 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </div>
                <span className="text-[10px] text-gray-400 ml-2">({opt.count})</span>
              </button>
            );
          })}
        </div>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg px-3 py-2 text-xs text-gray-400">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}

// --- Color autocomplete (with swatches) ---
interface ColorAutocompleteProps {
  colors: ProductFiltersResponse['colors'];
  selected: string[];
  onChange: (next: string[]) => void;
}

function ColorAutocomplete({ colors, selected, onChange }: ColorAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? colors.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : colors;

  const toggle = (label: string) => {
    const next = selected.includes(label) ? selected.filter((s) => s !== label) : [...selected, label];
    onChange(next);
  };

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((s) => {
            const c = colors.find((c) => c.label === s);
            return (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] font-medium px-2 py-0.5">
                <span className="h-2.5 w-2.5 rounded-full border border-white/50 shrink-0" style={{ backgroundColor: c?.hex || '#999' }} />
                {s}
                <button type="button" onClick={() => toggle(s)} aria-label={`Remove ${s}`} className="hover:text-brand-blue/60 leading-none">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 cursor-text hover:border-gray-300 transition-colors" onClick={() => setOpen(true)}>
        <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none min-w-0"
          placeholder="Search colors..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setQuery(''); }} className="text-gray-400 hover:text-gray-600">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.map((opt) => {
            const active = selected.includes(opt.label);
            return (
              <button
                key={`${opt.hex}-${opt.label}`}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); toggle(opt.label); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${active ? 'bg-brand-blue/5 text-brand-blue font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'}`}>
                    {active && (
                      <svg className="h-2 w-2 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="h-3.5 w-3.5 rounded-full border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: opt.hex || '#999' }} />
                  {opt.label}
                </div>
                <span className="text-[10px] text-gray-400 ml-2">({opt.count})</span>
              </button>
            );
          })}
        </div>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg px-3 py-2 text-xs text-gray-400">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}

const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

// --- Main sidebar ---
export function FiltersSidebar({ availableFilters, filters, onFiltersChange, isMobileOpen, onMobileClose }: FiltersSidebarProps) {
  const update = useCallback(
    (patch: Partial<ProductFilters>) => { onFiltersChange({ ...filters, ...patch, page: 1 }); },
    [filters, onFiltersChange]
  );

  const clearAll = () => {
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = !!(
    filters.colors?.length || filters.sizes?.length || filters.brands?.length ||
    filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.organic || filters.recycled
  );

  const content = (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Filters</span>
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={clearAll} className="text-xs text-brand-blue hover:underline font-medium">Clear all</button>
        )}
      </div>

      <FilterSection title="Price">
        <div className="flex flex-col gap-2">
          <Input type="number" min={0} placeholder={availableFilters ? `Min (${priceFormatter.format(availableFilters.priceRange.min)})` : 'Min €'} value={filters.minPrice ?? ''} onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })} className="h-8 text-xs w-full" />
          <Input type="number" min={0} placeholder={availableFilters ? `Max (${priceFormatter.format(availableFilters.priceRange.max)})` : 'Max €'} value={filters.maxPrice ?? ''} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })} className="h-8 text-xs w-full" />
        </div>
      </FilterSection>

      {availableFilters && availableFilters.sizes.length > 0 && (
        <FilterSection title="Size">
          <MultiSelectAutocomplete options={availableFilters.sizes} selected={filters.sizes ?? []} onChange={(next) => update({ sizes: next.length > 0 ? next : undefined })} placeholder="Search sizes..." />
        </FilterSection>
      )}

      {availableFilters && availableFilters.colors.length > 0 && (
        <FilterSection title="Color">
          <ColorAutocomplete colors={availableFilters.colors} selected={filters.colors ?? []} onChange={(next) => update({ colors: next.length > 0 ? next : undefined })} />
        </FilterSection>
      )}

      {availableFilters && availableFilters.brands.length > 0 && (
        <FilterSection title="Brand">
          <MultiSelectAutocomplete options={availableFilters.brands} selected={filters.brands ?? []} onChange={(next) => update({ brands: next.length > 0 ? next : undefined })} placeholder="Search brands..." />
        </FilterSection>
      )}

      <FilterSection title="Sustainability">
        <div className="space-y-2 pt-1">
          <label className="flex items-center justify-between cursor-pointer rounded-md px-1 py-0.5 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={filters.organic ?? false} onChange={(e) => update({ organic: e.target.checked ? true : undefined })} className="h-3.5 w-3.5 rounded accent-brand-blue cursor-pointer" />
              <span className="text-xs text-gray-700">Organic</span>
            </div>
            {availableFilters?.organic?.count !== undefined && <span className="text-[10px] text-gray-400">({availableFilters.organic.count})</span>}
          </label>
          <label className="flex items-center justify-between cursor-pointer rounded-md px-1 py-0.5 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={filters.recycled ?? false} onChange={(e) => update({ recycled: e.target.checked ? true : undefined })} className="h-3.5 w-3.5 rounded accent-brand-blue cursor-pointer" />
              <span className="text-xs text-gray-700">Recycled</span>
            </div>
            {availableFilters?.recycled?.count !== undefined && <span className="text-[10px] text-gray-400">({availableFilters.recycled.count})</span>}
          </label>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm scrollbar-hide">
          {content}
        </div>
      </aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative ml-auto h-full w-80 overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900">Filters</span>
              <button type="button" onClick={onMobileClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            {content}
            <div className="mt-6"><Button className="w-full bg-brand-blue text-white" onClick={onMobileClose}>Apply filters</Button></div>
          </div>
        </div>
      )}
    </>
  );
}
