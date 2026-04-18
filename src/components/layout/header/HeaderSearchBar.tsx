'use client';

import { Search } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';

interface HeaderSearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export function HeaderSearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: HeaderSearchBarProps) {
  return (
    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
      <div className="flex w-full rounded-full border border-gray-300 overflow-hidden focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
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
