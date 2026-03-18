'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard'; 
import type { Product } from '@/lib/products';

// --- MOCK DATA FOR 3 SLIDES ---
const SLIDES = [
    {
        id: 1,
        bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#E8ECE6', 
        label: 'OUR FAVORITE PRODUCTS',
        quote: '“A versatile beach staple. Crafted from 100% cotton and perfectly sized for lounging or changing”',
        author: 'Jenny Wilson',
        location: 'New Mexico',
        product: {
            id: 'p1',
            name: 'Lunara Flannel',
            price: 100.00,
            originalPrice: 120.00,
            image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=400&auto=format&fit=crop',
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
        bgImage: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#E6E4DD', 
        label: 'SUMMER ESSENTIALS',
        quote: '“The perfect lightweight layer for cool coastal mornings. Breathable, soft, and effortlessly stylish.”',
        author: 'Mark Robertson',
        location: 'California',
        product: {
            id: 'p2',
            name: 'Coastal Hoodie',
            price: 85.00,
            image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop',
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
        bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
        panelBg: '#DCE1E3', 
        label: 'MOUNTAIN READY',
        quote: '“Durable enough for the trail, comfortable enough for the cabin. These became my everyday go-to.”',
        author: 'Sarah Jenkins',
        location: 'Colorado',
        product: {
            id: 'p3',
            name: 'Trail Beanie',
            price: 35.00,
            image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=400&auto=format&fit=crop',
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

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };
    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return (
        <section className="relative w-full h-[820px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-100">

            {/* =========================================
                LAYER 1: BACKGROUND SLIDER (Moves)
            ========================================= */}
            <div
                className="absolute top-0 left-0 w-full h-full flex transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {SLIDES.map((slide) => (
                    <div key={`bg-${slide.id}`} className="relative w-full h-full shrink-0">
                        <img
                            src={slide.bgImage}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Moved card slightly higher on mobile (top-4) to maximize space */}
                        <div className="absolute top-4 md:top-1/2 left-1/2 md:left-8 lg:left-[15%] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 w-[280px] lg:w-[300px] bg-white p-3 md:p-4 rounded-2xl shadow-2xl z-0">
                            <ProductCard product={slide.product} />
                        </div>
                    </div>
                ))}
            </div>

            {/* =========================================
                LAYER 2: CONTENT PANEL OVERLAY (Fixed)
            ========================================= */}
            {/* REDUCED mobile panel height to 320px */}
            <div
                className="absolute bottom-0 md:top-0 md:bottom-auto right-0 md:right-7 w-full md:w-[50%] lg:w-[40%] h-[320px] md:h-full z-10 transition-colors duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] flex flex-col justify-center px-6 md:px-8 lg:px-16 border-t md:border-t-0 md:border-l border-black/5"
                style={{ backgroundColor: SLIDES[currentIndex].panelBg }}
            >

                {/* Navigation Controls - MOVED TO TOP ON MOBILE (top-5), Bottom on Desktop (md:bottom-12) */}
                <div className="absolute top-5 md:top-auto md:bottom-12 lg:bottom-16 left-6 md:left-8 lg:left-16 flex items-center gap-4 z-20">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                    </button>

                    <span className="text-xs md:text-sm font-bold text-gray-900 tracking-widest">
                        {currentIndex + 1} / {SLIDES.length}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === SLIDES.length - 1}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                    </button>
                </div>

                {/* Animated Inner Content */}
                {/* Added mt-12 md:mt-0 to push text below the new top-navigation on mobile */}
                <div className="relative w-full h-[220px] md:h-[350px] mt-12 md:mt-0 overflow-hidden">
                    {SLIDES.map((slide, idx) => {
                        let positionClass = 'opacity-0 translate-y-8 pointer-events-none';
                        if (idx === currentIndex) {
                            positionClass = 'opacity-100 translate-y-0 z-10';
                        } else if (idx < currentIndex) {
                            positionClass = 'opacity-0 -translate-y-8 pointer-events-none';
                        }

                        return (
                            <div
                                key={`content-${slide.id}`}
                                className={`absolute inset-0 flex flex-col justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${positionClass}`}
                            >
                                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-gray-900 mb-3 md:mb-6 block">
                                    {slide.label}
                                </span>
                                <h2 className="text-lg md:text-3xl xl:text-4xl font-bold text-gray-900 leading-[1.3] mb-4 md:mb-8 tracking-tight">
                                    {slide.quote}
                                </h2>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{slide.author}</p>
                                    <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">{slide.location}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

        </section>
    );
}