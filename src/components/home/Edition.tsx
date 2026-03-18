"use client"
import React from 'react';
import { CustomButton } from '@/components/ui/CustomButton';

const Edition = () => {
    return (
        <section className="py-16 bg-white">
            <div className="mx-auto max-w-[1440px] px-4">

                {/* 3-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-auto lg:h-[600px]">

                    {/* Left Column: Text & Navigation */}
                    <div className="flex flex-col justify-center pr-4 lg:pr-8 mb-10 lg:mb-0">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 mb-4 block">
                            SEASONAL EDITION
                        </span>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            The October Cleaner<br />Fashion
                        </h2>

                        <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed max-w-sm">
                            We create safe products that really work and are designed to make you feel good.
                        </p>

                        {/* Category List */}
                        <div className="flex flex-col gap-5 mb-10">
                            <div className="border-l-2 border-black pl-4 font-bold text-gray-900 cursor-pointer">
                                Outerwear Collection
                            </div>
                            <div className="border-l-2 border-transparent pl-4 font-bold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                                Cashmere Sweaters
                            </div>
                            <div className="border-l-2 border-transparent pl-4 font-bold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                                The Cold Weather
                            </div>
                        </div>

                        {/* Shop Button */}
                        <div>
                            <CustomButton
                                bgHover="#f3f4f6"
                                textHover="black"
                                className="bg-black text-white px-8 py-3.5 rounded-full font-semibold border-2 border-black transition-all"
                            >
                                Shop All Products
                            </CustomButton>
                        </div>
                    </div>

                    {/* Middle Column: Card 1 */}
                    <div className="rounded-2xl overflow-hidden flex flex-col h-[500px] lg:h-full group cursor-pointer shadow-lg">
                        {/* Image Section */}
                        <div className="relative flex-1 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop"
                                alt="Surfing Favorites"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                            {/* Title over image */}
                            <h3 className="absolute bottom-5 left-5 text-white text-2xl font-bold tracking-tight">
                                Surfing Favorites
                            </h3>
                        </div>

                        {/* Bottom Product Strip */}
                        <div className="bg-[#524E48] p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=150&auto=format&fit=crop"
                                    alt="Woods Fleece"
                                    className="w-12 h-12 rounded object-cover bg-gray-200"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">Woods Fleece</span>
                                    <span className="text-gray-300 text-xs">$200.00</span>
                                </div>
                            </div>
                            <CustomButton
                                bgHover="#e5e5e5"
                                textHover="black"
                                className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold border-none"
                            >
                                Shop
                            </CustomButton>
                        </div>
                    </div>

                    {/* Right Column: Card 2 */}
                    <div className="rounded-2xl overflow-hidden flex flex-col h-[500px] lg:h-full group cursor-pointer shadow-lg">
                        {/* Image Section */}
                        <div className="relative flex-1 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=800&auto=format&fit=crop"
                                alt="Classic Accessories"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                            {/* Title over image */}
                            <h3 className="absolute bottom-5 left-5 text-white text-2xl font-bold tracking-tight">
                                Classic Accessories
                            </h3>
                        </div>

                        {/* Bottom Product Strip */}
                        <div className="bg-[#48423E] p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1576822441990-01dc09ac7471?q=80&w=150&auto=format&fit=crop"
                                    alt="Cody Beanie"
                                    className="w-12 h-12 rounded object-cover bg-gray-200"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">Cody Beanie</span>
                                    <span className="text-gray-300 text-xs">$200.00</span>
                                </div>
                            </div>
                            <CustomButton
                                bgHover="#e5e5e5"
                                textHover="black"
                                className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold border-none"
                            >
                                Shop
                            </CustomButton>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Edition;