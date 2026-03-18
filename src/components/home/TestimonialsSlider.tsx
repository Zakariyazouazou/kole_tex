'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Melissa H.',
    verified: true,
    review: '“Hands down one of the best shirts I’ve ever owned. Fits great, feels amazing, seems to stay cool.”',
    mainImage: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=400&auto=format&fit=crop',
    productName: 'Down Jacket',
    productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Cindy L.',
    verified: true,
    review: '“The denim is strong and of high quality, with just a bit of stretch.”',
    mainImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop',
    productName: 'Trendy Pants',
    productImage: 'https://images.unsplash.com/photo-1604176354204-926873ff34b1?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Wilson J.',
    verified: true,
    review: '“Hands down one of the best shirts I’ve ever owned. Fits great, feels amazing, seems to stay cool.”',
    mainImage: 'https://images.unsplash.com/photo-1559582798-678dfc71ce5e?q=80&w=400&auto=format&fit=crop',
    productName: 'Banks Hood',
    productImage: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Samantha T.',
    verified: true,
    review: '“This shirt is among the top in my closet. It breathes excellently.”',
    mainImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
    productName: 'Bonded Hoodie',
    productImage: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Marcus D.',
    verified: true,
    review: '“Perfect fit right out of the box. Highly recommend the craftsmanship here.”',
    mainImage: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=400&auto=format&fit=crop',
    productName: 'Lunara Flannel',
    productImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=100&auto=format&fit=crop',
  }
];

export function TestimonialsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // States from your logic
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Boundary states for arrows
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Unified scroll handler (Progress Bar + Boundaries)
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Calculate progress
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      
      // Check boundaries
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
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
      // Initialize states on mount
      handleScroll();
      window.addEventListener('resize', handleScroll);
      
      return () => {
        current.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <section className="py-16 md:py-24 bg-[#EBE7DF] overflow-hidden">
      
      {/* Header - Constrained */}
      <div className="mx-auto max-w-[1440px] px-4 mb-10 md:mb-12 flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Clients Love Us
        </h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 ${
              !canScrollLeft 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-[#1C2C45] hover:border-[#1C2C45] hover:text-white cursor-pointer'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 ${
              !canScrollRight 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-[#1C2C45] hover:border-[#1C2C45] hover:text-white cursor-pointer'
            }`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slider Container - Full Width */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={terminateDragging}
          onMouseUp={terminateDragging}
          onMouseMove={handleMouseMove}
          className={`flex gap-4 lg:gap-6 overflow-x-auto overflow-y-hidden pb-4 touch-pan-x [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging 
              ? 'cursor-grabbing select-none scroll-auto' 
              : 'cursor-grab scroll-smooth'
          }`}
        >
          {/* Invisible Gap at Start to align perfectly with the container */}
          <div className="flex-none w-[max(1rem,calc((100vw-1440px)/2))] lg:w-[max(2rem,calc((100vw-1440px)/2))]" />

          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-none w-[320px] md:w-[460px] lg:w-[500px] bg-white rounded-2xl p-6 flex flex-col justify-between"
            >
              {/* Top: Review Text & Big Image */}
              <div className="flex gap-4 md:gap-6 mb-6">
                <div className="flex-1 flex flex-col pointer-events-none">
                  <div className="mb-4 flex flex-col items-start gap-1">
                    <span className="font-bold text-gray-900">{testimonial.name}</span>
                    {testimonial.verified && (
                      <span className="text-[11px] text-gray-400 font-medium">Verified Buyer</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {testimonial.review}
                  </p>
                </div>
                
                {/* Big Lifestyle Image */}
                <div className="w-24 h-32 md:w-32 md:h-40 shrink-0 overflow-hidden rounded-xl pointer-events-none select-none">
                  <img
                    src={testimonial.mainImage}
                    alt="Customer Lifestyle"
                    draggable="false"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Divider Line */}
              <div className="w-full h-[1px] bg-gray-100 mb-5" />

              {/* Bottom: Product Info */}
              <div className="flex items-center gap-3 pointer-events-none select-none">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-gray-50 overflow-hidden shrink-0">
                  <img
                    src={testimonial.productImage}
                    alt={testimonial.productName}
                    draggable="false"
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {testimonial.productName}
                </span>
              </div>
            </div>
          ))}

          {/* Invisible gap at end for breathing room */}
          <div className="flex-none w-[max(1rem,calc((100vw-1440px)/2))] lg:w-[max(2rem,calc((100vw-1440px)/2))]" />
        </div>
      </div>
    </section>
  );
}