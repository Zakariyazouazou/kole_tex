export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: 'New' | 'Sale' | 'Popular' | 'Best Seller';
  description: string;
  specifications: Record<string, string>;
  variants: {
    sizes?: string[];
    colors?: string[];
  };
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 1243,
    image: 'https://picsum.photos/seed/prod1/400/400',
    images: [
      'https://picsum.photos/seed/prod1a/400/400',
      'https://picsum.photos/seed/prod1b/400/400',
      'https://picsum.photos/seed/prod1c/400/400',
    ],
    badge: 'Best Seller',
    description: 'Experience immersive sound with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers, commuters, and remote workers who demand crystal-clear audio quality.',
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Battery Life': '30 hours',
      'Bluetooth': '5.3',
      'Weight': '250g',
      'Noise Cancellation': 'Active (ANC)',
    },
    variants: {
      colors: ['Black', 'White', 'Navy'],
    },
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Smartwatch Pro',
    slug: 'premium-smartwatch-pro',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 349.99,
    rating: 4.6,
    reviewCount: 876,
    image: 'https://picsum.photos/seed/prod2/400/400',
    images: [
      'https://picsum.photos/seed/prod2a/400/400',
      'https://picsum.photos/seed/prod2b/400/400',
      'https://picsum.photos/seed/prod2c/400/400',
    ],
    badge: 'New',
    description: 'Stay connected and track your fitness with this advanced smartwatch featuring GPS, heart rate monitoring, sleep tracking, and a stunning AMOLED display. Water-resistant up to 50 meters with 7-day battery life.',
    specifications: {
      'Display': '1.4" AMOLED',
      'Resolution': '454x454',
      'Battery Life': '7 days',
      'Water Resistance': '5 ATM',
      'Sensors': 'HR, SpO2, GPS, Accelerometer',
      'Compatibility': 'iOS & Android',
    },
    variants: {
      colors: ['Silver', 'Black', 'Rose Gold'],
      sizes: ['40mm', '44mm'],
    },
    inStock: true,
  },
  {
    id: '3',
    name: 'Ultra-Slim Laptop Stand',
    slug: 'ultra-slim-laptop-stand',
    category: 'Electronics',
    subcategory: 'Accessories',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.5,
    reviewCount: 2134,
    image: 'https://picsum.photos/seed/prod3/400/400',
    images: [
      'https://picsum.photos/seed/prod3a/400/400',
      'https://picsum.photos/seed/prod3b/400/400',
      'https://picsum.photos/seed/prod3c/400/400',
    ],
    badge: 'Sale',
    description: 'Elevate your workspace with this sleek, foldable aluminum laptop stand. Ergonomic design raises your screen to eye level, improving posture and airflow. Compatible with laptops from 10" to 17".',
    specifications: {
      'Material': 'Aluminum Alloy',
      'Weight Capacity': '20kg',
      'Adjustable Height': '6 levels',
      'Compatibility': '10"-17" laptops',
      'Weight': '280g',
      'Foldable': 'Yes',
    },
    variants: {
      colors: ['Silver', 'Space Gray'],
    },
    inStock: true,
  },
  {
    id: '4',
    name: 'Classic Fit Cotton Polo Shirt',
    slug: 'classic-fit-cotton-polo-shirt',
    category: 'Clothing',
    subcategory: 'Men',
    price: 45.00,
    rating: 4.4,
    reviewCount: 567,
    image: 'https://picsum.photos/seed/prod4/400/400',
    images: [
      'https://picsum.photos/seed/prod4a/400/400',
      'https://picsum.photos/seed/prod4b/400/400',
      'https://picsum.photos/seed/prod4c/400/400',
    ],
    badge: 'Popular',
    description: 'Premium 100% organic cotton polo shirt with a classic fit that never goes out of style. Features breathable fabric, reinforced collar, and a subtle embroidered logo. Perfect for both casual and semi-formal occasions.',
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Classic',
      'Care': 'Machine washable',
      'Collar': 'Ribbed knit',
      'Origin': 'Ethically sourced',
    },
    variants: {
      colors: ['Sage Green', 'White', 'Navy', 'Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    inStock: true,
  },
  {
    id: '15',
    name: 'Leo 84 Classic',
    slug: 'leo-84-classic',
    category: 'Clothing',
    subcategory: 'Pants',
    price: 130.00,
    rating: 4.8,
    reviewCount: 42,
    image: 'https://picsum.photos/seed/pants1/400/500',
    images: [
      'https://picsum.photos/seed/pants1-back/400/500',
    ],
    badge: 'New',
    description: 'Classic fit denim pants with a modern silhouette.',
    specifications: {
      'Material': '100% Cotton Denim',
      'Fit': 'Classic',
    },
    variants: {
      colors: ['Gray', 'Arctic White', 'Midnight Blue'],
    },
    inStock: true,
  },
  {
    id: '16',
    name: 'Timber Flannel',
    slug: 'timber-flannel',
    category: 'Clothing',
    subcategory: 'Flannel',
    price: 100.00,
    rating: 4.9,
    reviewCount: 128,
    image: 'https://picsum.photos/seed/flannel1/400/500',
    images: [
      'https://picsum.photos/seed/flannel1-detail/400/500',
    ],
    description: 'Ultra-soft Timber Flannel for the perfect rugged look.',
    specifications: {
      'Material': '100% Brushed Cotton',
    },
    variants: {
      colors: ['Camel', 'Cream'],
    },
    inStock: true,
  },
  {
    id: '6',
    name: 'Women\'s Athleisure Jacket',
    slug: 'womens-athleisure-jacket',
    category: 'Clothing',
    subcategory: 'Women',
    price: 75.00,
    rating: 4.3,
    reviewCount: 198,
    image: 'https://picsum.photos/seed/prod6/400/400',
    images: [
      'https://picsum.photos/seed/prod6a/400/400',
      'https://picsum.photos/seed/prod6b/400/400',
      'https://picsum.photos/seed/prod6c/400/400',
    ],
    description: 'Versatile athleisure jacket that transitions seamlessly from the gym to brunch. Features moisture-wicking fabric, thumb holes, two zippered pockets, and a flattering tapered silhouette.',
    specifications: {
      'Material': '88% Polyester, 12% Elastane',
      'Fit': 'Fitted',
      'Features': 'Moisture-wicking, 4-way stretch',
      'Pockets': '2 zippered',
      'Care': 'Machine washable',
    },
    variants: {
      colors: ['Black', 'Dusty Rose', 'Olive'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    inStock: true,
  },
  {
    id: '7',
    name: 'Ceramic Non-Stick Cookware Set',
    slug: 'ceramic-non-stick-cookware-set',
    category: 'Home & Kitchen',
    subcategory: 'Cookware',
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviewCount: 891,
    image: 'https://picsum.photos/seed/prod7/400/400',
    images: [
      'https://picsum.photos/seed/prod7a/400/400',
      'https://picsum.photos/seed/prod7b/400/400',
      'https://picsum.photos/seed/prod7c/400/400',
    ],
    badge: 'Best Seller',
    description: 'Professional-grade 10-piece ceramic cookware set with PFOA-free non-stick coating. Includes frying pans, saucepans, and a Dutch oven with tempered glass lids. Oven-safe up to 450°F.',
    specifications: {
      'Pieces': '10',
      'Material': 'Aluminum with ceramic coating',
      'Oven Safe': 'Up to 450°F',
      'Dishwasher Safe': 'Yes',
      'Induction Compatible': 'Yes',
      'Coating': 'PFOA-free ceramic',
    },
    variants: {
      colors: ['Cream', 'Gray', 'Teal'],
    },
    inStock: true,
  },
  {
    id: '8',
    name: 'Minimalist Desk Organizer',
    slug: 'minimalist-desk-organizer',
    category: 'Home & Kitchen',
    subcategory: 'Organization',
    price: 34.99,
    rating: 4.2,
    reviewCount: 456,
    image: 'https://picsum.photos/seed/prod8/400/400',
    images: [
      'https://picsum.photos/seed/prod8a/400/400',
      'https://picsum.photos/seed/prod8b/400/400',
      'https://picsum.photos/seed/prod8c/400/400',
    ],
    badge: 'New',
    description: 'Keep your workspace tidy with this minimalist desk organizer crafted from sustainable bamboo. Features compartments for pens, cards, phone, and small accessories. Clean lines that complement any office decor.',
    specifications: {
      'Material': 'Sustainable Bamboo',
      'Dimensions': '25 x 15 x 12 cm',
      'Compartments': '5',
      'Weight': '400g',
      'Finish': 'Natural matte',
    },
    variants: {
      colors: ['Natural', 'Walnut'],
    },
    inStock: true,
  },
  {
    id: '9',
    name: 'Luxury Scented Candle Collection',
    slug: 'luxury-scented-candle-collection',
    category: 'Home & Kitchen',
    subcategory: 'Decor',
    price: 42.00,
    rating: 4.9,
    reviewCount: 1567,
    image: 'https://picsum.photos/seed/prod9/400/400',
    images: [
      'https://picsum.photos/seed/prod9a/400/400',
      'https://picsum.photos/seed/prod9b/400/400',
      'https://picsum.photos/seed/prod9c/400/400',
    ],
    badge: 'Popular',
    description: 'Set of 3 hand-poured soy wax candles in elegant ceramic vessels. Each candle features a unique blend of essential oils for a luxurious aromatherapy experience. Burn time of 45+ hours per candle.',
    specifications: {
      'Wax': '100% Soy',
      'Wick': 'Cotton, lead-free',
      'Burn Time': '45+ hours each',
      'Weight': '200g each',
      'Scents': 'Lavender, Vanilla, Sandalwood',
      'Vessel': 'Reusable ceramic',
    },
    variants: {},
    inStock: true,
  },
  {
    id: '10',
    name: 'Professional Yoga Mat',
    slug: 'professional-yoga-mat',
    category: 'Sports',
    subcategory: 'Yoga',
    price: 68.00,
    rating: 4.7,
    reviewCount: 723,
    image: 'https://picsum.photos/seed/prod10/400/400',
    images: [
      'https://picsum.photos/seed/prod10a/400/400',
      'https://picsum.photos/seed/prod10b/400/400',
      'https://picsum.photos/seed/prod10c/400/400',
    ],
    badge: 'Popular',
    description: 'Premium 6mm thick yoga mat with superior grip and cushioning. Made from eco-friendly natural rubber with a microfiber suede surface that gets grippier with moisture. Includes carrying strap.',
    specifications: {
      'Material': 'Natural Rubber + Microfiber Suede',
      'Thickness': '6mm',
      'Dimensions': '183 x 68 cm',
      'Weight': '2.5kg',
      'Eco-Friendly': 'Yes, biodegradable',
      'Includes': 'Carrying strap',
    },
    variants: {
      colors: ['Midnight Blue', 'Forest Green', 'Sunrise Pink'],
    },
    inStock: true,
  },
  {
    id: '11',
    name: 'Insulated Water Bottle',
    slug: 'insulated-water-bottle',
    category: 'Sports',
    subcategory: 'Accessories',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviewCount: 1890,
    image: 'https://picsum.photos/seed/prod11/400/400',
    images: [
      'https://picsum.photos/seed/prod11a/400/400',
      'https://picsum.photos/seed/prod11b/400/400',
      'https://picsum.photos/seed/prod11c/400/400',
    ],
    badge: 'Sale',
    description: 'Double-wall vacuum insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid with one-hand operation. 750ml capacity.',
    specifications: {
      'Material': '18/8 Stainless Steel',
      'Capacity': '750ml',
      'Insulation': 'Double-wall vacuum',
      'Cold Retention': '24 hours',
      'Hot Retention': '12 hours',
      'BPA Free': 'Yes',
    },
    variants: {
      colors: ['Matte Black', 'Arctic White', 'Ocean Blue', 'Rose Gold'],
    },
    inStock: true,
  },
  {
    id: '12',
    name: 'Resistance Band Set',
    slug: 'resistance-band-set',
    category: 'Sports',
    subcategory: 'Fitness',
    price: 24.99,
    rating: 4.4,
    reviewCount: 2341,
    image: 'https://picsum.photos/seed/prod12/400/400',
    images: [
      'https://picsum.photos/seed/prod12a/400/400',
      'https://picsum.photos/seed/prod12b/400/400',
      'https://picsum.photos/seed/prod12c/400/400',
    ],
    badge: 'Best Seller',
    description: 'Complete set of 5 premium latex resistance bands with varying resistance levels. Includes door anchor, ankle straps, and handles. Perfect for home workouts, physical therapy, and travel fitness.',
    specifications: {
      'Bands': '5 (10-50 lbs)',
      'Material': 'Natural Latex',
      'Includes': 'Door anchor, 2 ankle straps, 2 handles, carry bag',
      'Length': '120cm each',
      'Stackable': 'Yes, up to 150 lbs combined',
    },
    variants: {},
    inStock: true,
  },
  {
    id: '13',
    name: 'Bluetooth Portable Speaker',
    slug: 'bluetooth-portable-speaker',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 79.99,
    rating: 4.3,
    reviewCount: 654,
    image: 'https://picsum.photos/seed/prod13/400/400',
    images: [
      'https://picsum.photos/seed/prod13a/400/400',
      'https://picsum.photos/seed/prod13b/400/400',
      'https://picsum.photos/seed/prod13c/400/400',
    ],
    description: 'Compact yet powerful Bluetooth speaker with 360° immersive sound. IP67 waterproof and dustproof, perfect for outdoor adventures. 20-hour battery life with built-in power bank functionality.',
    specifications: {
      'Output Power': '20W',
      'Bluetooth': '5.3',
      'Battery Life': '20 hours',
      'Waterproof': 'IP67',
      'Weight': '560g',
      'Charging': 'USB-C',
    },
    variants: {
      colors: ['Black', 'Teal', 'Red'],
    },
    inStock: true,
  },
  {
    id: '14',
    name: 'Linen Blend Throw Blanket',
    slug: 'linen-blend-throw-blanket',
    category: 'Home & Kitchen',
    subcategory: 'Decor',
    price: 55.00,
    rating: 4.8,
    reviewCount: 412,
    image: 'https://picsum.photos/seed/prod14/400/400',
    images: [
      'https://picsum.photos/seed/prod14a/400/400',
      'https://picsum.photos/seed/prod14b/400/400',
      'https://picsum.photos/seed/prod14c/400/400',
    ],
    badge: 'New',
    description: 'Beautifully textured linen-cotton blend throw blanket, perfect for adding a layer of warmth and style to any room. Pre-washed for a lived-in softness with elegant fringe detail.',
    specifications: {
      'Material': '60% Linen, 40% Cotton',
      'Dimensions': '130 x 170 cm',
      'Weight': '800g',
      'Care': 'Machine washable',
      'Finish': 'Pre-washed, fringed edges',
    },
    variants: {
      colors: ['Natural', 'Dusty Blue', 'Sage', 'Terracotta'],
    },
    inStock: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge).slice(0, 8);
}
