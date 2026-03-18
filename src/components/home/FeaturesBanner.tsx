import React from 'react';
import { Droplets, Leaf, ShoppingBag } from 'lucide-react';

export function FeaturesBanner() {
  return (
    <section className="w-full bg-[#1C2C45] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start lg:items-center">
          
          {/* Column 1: Main Title */}
          <div className="lg:pr-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-[1.2] tracking-tight">
              Today Quality, Durability &<br className="hidden md:block" /> Good Looks
            </h2>
          </div>

          {/* Column 2: Organic Cotton */}
          <div className="flex flex-col items-center text-center">
            <Droplets className="w-8 h-8 text-white mb-5 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
              Organic Cotton
            </h3>
            <p className="text-sm text-blue-50/70 leading-relaxed max-w-[260px]">
              Currently, 82% feature organic or recycled materials
            </p>
          </div>

          {/* Column 3: Life Cycle */}
          <div className="flex flex-col items-center text-center">
            <Leaf className="w-8 h-8 text-white mb-5 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
              Life Cycle
            </h3>
            <p className="text-sm text-blue-50/70 leading-relaxed max-w-[260px]">
              Our Repairs Program revives beloved products, keeping them in action.
            </p>
          </div>

          {/* Column 4: Recycle Bags */}
          <div className="flex flex-col items-center text-center">
            <ShoppingBag className="w-8 h-8 text-white mb-5 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
              Recycle Bags
            </h3>
            <p className="text-sm text-blue-50/70 leading-relaxed max-w-[260px]">
              Orders ship in compostable poly mailers and recycled corrugate
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FeaturesBanner;