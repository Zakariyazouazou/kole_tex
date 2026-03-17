'use client';

import { Search, ChevronDown } from 'lucide-react';
import { categories } from '@/lib/categories';
import { CustomButton } from '@/components/ui/CustomButton';


interface HeaderSearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchCategory: string;
  setSearchCategory: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export function HeaderSearchBar({
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory,
  handleSearch,
}: HeaderSearchBarProps) {
  return (
    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
      <div className="flex w-full rounded-full border border-gray-300 overflow-hidden focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
        <div className="relative">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="h-full appearance-none bg-gray-50 border-r border-gray-300 pl-4 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="flex-1 bg-white py-2.5 px-4 text-sm outline-none"
        />
        <CustomButton
          type="submit"
          className="px-4 border-brand-blue bg-brand-blue text-white rounded-l-none"
          bgHover="white"
          textHover="#2d3a7a"

        >
          <Search className="h-5 w-5" />
        </CustomButton>

      </div>
    </form>
  );
}
