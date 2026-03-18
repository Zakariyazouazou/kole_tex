'use client';

import { Link } from '@/i18n/navigation';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundComponent() {

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center mt-15">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white rounded-full p-8 shadow-2xl border border-gray-100 animate-bounce duration-3000">
              <Ghost className="h-15 w-15 text-brand-blue" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter italic">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn’t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 h-12 font-bold bg-brand-blue hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full px-8 h-12 font-bold border-gray-200 hover:bg-gray-50"
            onClick={() => typeof window !== 'undefined' && window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="pt-12 border-t border-gray-50">
          <p className="text-sm text-gray-400 mb-6 uppercase tracking-widest font-bold">
            Try searching instead
          </p>
          <div className="relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}