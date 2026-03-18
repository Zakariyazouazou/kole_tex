'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard'; // <-- Adjust this import to wherever your ProductCard is
import type { Product } from '@/lib/products';

// --- MOCK DATA FOR 3 SLIDES ---
const SLIDES = [
    {
        id: 1,
        // Beach lifestyle background
        bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#E8ECE6', // Light grayish green
        label: 'OUR FAVORITE PRODUCTS',
        quote: '“A versatile beach staple. Crafted from 100% cotton and perfectly sized for lounging or changing”',
        author: 'Jenny Wilson',
        location: 'New Mexico',
        product: {
            id: 'p1',
            name: 'Lunara Flannel',
            price: 100.00,
            originalPrice: 120.00,
            // Folded flannel shirt
            image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=400&auto=format&fit=crop',
            // Flannel detail/alternate
            images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop'],
            category: 'Flannel',
            subcategory: 'Flannel',
            rating: 5,
            inStock: true,
            variants: { colors: ['Cream', 'Dusty Blue'] }
        } as Product
    },
    {
        id: 2,
        // Coastal rocks/ocean background
        bgImage: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#E6E4DD', // Light warm beige
        label: 'SUMMER ESSENTIALS',
        quote: '“The perfect lightweight layer for cool coastal mornings. Breathable, soft, and effortlessly stylish.”',
        author: 'Mark Robertson',
        location: 'California',
        product: {
            id: 'p2',
            name: 'Coastal Hoodie',
            price: 85.00,
            // Clean hoodie product shot
            image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop',
            // Lifestyle hoodie shot
            images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=400&auto=format&fit=crop'],
            category: 'Hoodies',
            subcategory: 'Outerwear',
            rating: 4.5,
            inStock: true,
            variants: { colors: ['Navy', 'Gray'] }
        } as Product
    },
    {
        id: 3,
        // Mountain/lake background
        bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#DCE1E3', // Light icy blue/gray
        label: 'MOUNTAIN READY',
        quote: '“Durable enough for the trail, comfortable enough for the cabin. These became my everyday go-to.”',
        author: 'Sarah Jenkins',
        location: 'Colorado',
        product: {
            id: 'p3',
            name: 'Trail Beanie',
            price: 35.00,
            // Beanie product shot
            image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=400&auto=format&fit=crop',
            // Alternate beanie/lifestyle shot
            images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop'],
            category: 'Accessories',
            subcategory: 'Hats',
            rating: 5,
            inStock: true,
            variants: { colors: ['Burgundy', 'Black'] }
        } as Product
    }
];

export default function DualSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Stop at boundaries (0 and 2)
    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };
    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return (
        <section className="relative w-full h-[600px] lg:h-[700px] overflow-hidden bg-gray-100">

            {/* =========================================
          LAYER 1: BACKGROUND SLIDER (Moves)
      ========================================= */}
            <div
                className="absolute top-0 left-0 w-full h-full flex transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {SLIDES.map((slide) => (
                    <div key={`bg-${slide.id}`} className="relative w-full h-full shrink-0">
                        {/* Full width background image */}
                        <img
                            src={slide.bgImage}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Product Card Container - Positioned to the left */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 lg:left-[15%] w-[280px] lg:w-[300px] bg-white p-4 rounded-2xl shadow-2xl z-0">
                            <ProductCard product={slide.product} />
                        </div>
                    </div>
                ))}
            </div>

            {/* =========================================
          LAYER 2: CONTENT PANEL OVERLAY (Fixed)
      ========================================= */}
            <div
                className="absolute top-0 right-7 h-full w-[85%] sm:w-[50%] md:w-[45%] lg:w-[40%] z-10 transition-colors duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] flex flex-col justify-center px-8 lg:px-16 border-l border-black/5"
                style={{ backgroundColor: SLIDES[currentIndex].panelBg }}
            >

                {/* Animated Inner Content (Overflow Hidden) */}
                <div className="relative w-full h-[350px] overflow-hidden">
                    {SLIDES.map((slide, idx) => {
                        // Determine position for animation
                        let positionClass = 'opacity-0 translate-y-8 pointer-events-none'; // Default (upcoming)
                        if (idx === currentIndex) {
                            positionClass = 'opacity-100 translate-y-0 z-10'; // Active
                        } else if (idx < currentIndex) {
                            positionClass = 'opacity-0 -translate-y-8 pointer-events-none'; // Past
                        }

                        return (
                            <div
                                key={`content-${slide.id}`}
                                className={`absolute inset-0 flex flex-col justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${positionClass}`}
                            >
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-900 mb-6 block">
                                    {slide.label}
                                </span>
                                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-[1.3] mb-8 tracking-tight">
                                    {slide.quote}
                                </h2>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{slide.author}</p>
                                    <p className="text-sm text-gray-500 mt-1">{slide.location}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Controls (Fixed at bottom of panel) */}
                <div className="absolute bottom-12 lg:bottom-16 left-8 lg:left-16 flex items-center gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-900" />
                    </button>

                    <span className="text-sm font-bold text-gray-900 tracking-widest">
                        {currentIndex + 1} / {SLIDES.length}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === SLIDES.length - 1}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-900" />
                    </button>
                </div>

            </div>

        </section>
    );
}