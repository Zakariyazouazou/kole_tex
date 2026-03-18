import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function TrustAndBrands() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        
        {/* =========================================
            TOP SECTION: BRANDS
        ========================================= */}
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-10 md:mb-12">
            SHOP BY BRANDS
          </span>
          
          {/* Brand Logos Wrapper */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-24 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Note: Replace these spans with actual <img> tags of your brand logos */}
            <span className="font-serif text-2xl lg:text-3xl italic tracking-tight text-gray-900">Blanca</span>
            <span className="font-serif text-2xl lg:text-3xl text-gray-900 tracking-tight">Libreria</span>
            <span className="font-sans text-xl lg:text-2xl font-black uppercase text-gray-900 tracking-widest">LALIBU</span>
            <span className="font-serif text-xl lg:text-2xl uppercase tracking-[0.3em] text-gray-900 font-light">OLIVEA</span>
            <span className="font-serif text-2xl lg:text-3xl lowercase text-gray-900">amore</span>
            <span className="font-serif text-xl lg:text-2xl uppercase text-gray-900 tracking-widest font-medium">AVOCADO</span>
          </div>
        </div>

        {/* =========================================
            DIVIDER LINE
        ========================================= */}
        <div className="w-full h-[1px] bg-gray-200"></div>

        {/* =========================================
            BOTTOM SECTION: FEATURES
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 pt-16 md:pt-20">
          
          {/* Feature 1: Free Shipping */}
          <div className="flex flex-col items-center text-center group">
            <Truck className="w-10 h-10 lg:w-12 lg:h-12 text-gray-900 mb-6 stroke-[1.2] group-hover:-translate-y-1 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
              Free Shipping
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mb-6">
              All orders over $120 are delivered to your doorstep at no extra charge.
            </p>
            <Link 
              href="/shipping" 
              className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#1C2C45] transition-colors"
            >
              Explore Now 
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 2: Free Returns */}
          <div className="flex flex-col items-center text-center group">
            <RefreshCcw className="w-10 h-10 lg:w-12 lg:h-12 text-gray-900 mb-6 stroke-[1.2] group-hover:-translate-y-1 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
              30-Days Free Returns
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mb-6">
              Enjoy the freedom of stress-free shopping with our hassle-free and return policy.
            </p>
            <Link 
              href="/returns" 
              className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#1C2C45] transition-colors"
            >
              Return Policy 
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 3: Secure Payment */}
          <div className="flex flex-col items-center text-center group">
            <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-gray-900 mb-6 stroke-[1.2] group-hover:-translate-y-1 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
              Secure Payment
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mb-6">
              Shop with confidence knowing your payments are secure and your information
            </p>
            <Link 
              href="/payment" 
              className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#1C2C45] transition-colors"
            >
              More About Payment 
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

export default TrustAndBrands;