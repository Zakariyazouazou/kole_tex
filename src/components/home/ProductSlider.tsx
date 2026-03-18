'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CustomButton } from '@/components/ui/CustomButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function ProductSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const terminateDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.clientX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll, { passive: true });
      return () => current.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const items = [
    { title: 'Chino Pant', tag: 'CHINO PANT', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&h=500&auto=format&fit=crop' },
    { title: 'Retro Sweaters', tag: 'SWEATERS', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Cotton Made', tag: 'PUFFERS', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Casual Shorts', tag: 'SHORTS', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Made Cotton', tag: 'FLANNEL', img: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Winter Jacket', tag: 'OUTERWEAR', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Classic Denim', tag: 'JEANS', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Urban Hoodie', tag: 'HOODIES', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Graphic Tee', tag: 'TSHIRTS', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&h=500&auto=format&fit=crop' },
    { title: 'Cargo Pants', tag: 'PANTS', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1000&auto=format&fit=crop' },
    { title: 'Windbreaker', tag: 'JACKETS', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&h=1000&auto=format&fit=crop' },
  ];

  return (
    <section className="py-7 lg:py-16 bg-white overflow-hidden">
      {/* Header - Constrained */}
      <div className="mx-auto max-w-[1440px] px-4 mb-12 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">
          EFFORTLESS ELEGANCE
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
          Explore our collection of <span className="relative">shoes & bags <span className="absolute bottom-1 left-0 w-full h-1 bg-amber-200/60 -z-10"></span></span> from chic <span className="relative">boots <span className="absolute bottom-1 left-0 w-full h-1 bg-amber-200/60 -z-10"></span></span> to loafers
        </h2>
      </div>

      {/* Slider Container - Full Width */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={terminateDragging}
          onMouseUp={terminateDragging}
          onMouseMove={handleMouseMove}
          // Removed CSS snapping entirely to allow free-stopping
          className={`flex gap-4 lg:gap-6 overflow-x-auto overflow-y-hidden pb-10 touch-pan-x [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging 
              ? 'cursor-grabbing select-none scroll-auto' 
              : 'cursor-grab scroll-smooth'
          }`}
        >
          {/* Invisible Gap at Start - Removed snap-start */}
          <div className="flex-none w-[max(1rem,calc((100vw-1440px)/2))] lg:w-[max(2rem,calc((100vw-1440px)/2))]" />

          {items.map((item, i) => (
            <div
              key={i}
              // Removed snap-start snap-always
              className="flex-none w-[280px] lg:w-[350px] aspect-4/5 relative group rounded-2xl overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />

              {/* Top Tag */}
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1.5 rounded-full border border-white/40 bg-black/10 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-6 transform transition-transform group-hover:-translate-y-1">{item.title}</h3>
                <Link href="/products" className="inline-block">
                  <CustomButton
                    bgHover="white"
                    textHover="black"
                    className="bg-white text-black border-none px-6 py-2.5 shadow-xl font-bold transition-all duration-300"
                  >
                    Shop Now
                  </CustomButton>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation & Progress Bar */}
        <div className='w-full flex justify-center '>
          <div className="mt-1 lg:mt-8 pt-1 lg:pt-8 relative w-[90vw] lg:w-[80vw]">

            {/* Progress Bar Background */}
            <div
              className="absolute top-8 left-0 h-0.5 bg-gray-100 transition-all duration-300 w-full"
            />
            {/* Active Progress Line */}
            <div
              className="absolute top-8 left-0 h-0.5 bg-gray-900 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />

            {/* Navigation Arrows */}
            <div className="mx-auto max-w-[1440px] px-4 flex justify-end relative z-10">
              <div className="flex gap-3 bg-white pl-4">
                <button
                  onClick={() => scroll('left')}
                  className="h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}