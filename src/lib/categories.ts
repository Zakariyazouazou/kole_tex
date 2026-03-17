export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  name: string;
  slug: string;
  image?: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
  featuredProducts?: { name: string; image: string; href: string }[];
}

export const categories: Category[] = [
  {
    name: 'Shop By Categories',
    slug: 'shop-by-categories',
    subcategories: [
      { name: 'Tops', slug: 'tops' },
      { name: 'Bottoms', slug: 'bottoms' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Collections', slug: 'collections' },
    ],
    featuredProducts: [
      { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&h=400', href: '/products?category=New+Arrivals' },
      { name: 'Graphic Tees', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&h=400', href: '/products?category=Graphic+Tees' },
      { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&h=400', href: '/products?category=Jackets' },
      { name: 'Sweaters', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&h=400', href: '/products?category=Sweaters' },
      { name: 'Flannels', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&h=400', href: '/products?category=Flannels' },
      { name: 'Hoodies & Sweatshirts', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&h=400', href: '/products?category=Hoodies' },
      { name: 'Shirts', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&h=400', href: '/products?category=Shirts' },
      { name: 'Knits & Basics', image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&w=300&h=400', href: '/products?category=Knits' },
    ]
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    subcategories: [
      { name: 'Shop All', slug: 'shop-all' },
      { name: 'Graphic Tees', slug: 'graphic-tees' },
      { name: 'Sweaters', slug: 'sweaters' },
      { name: 'Flannels', slug: 'flannels' },
      { name: 'Hoodies & Sweatshirts', slug: 'hoodies' }
    ]
  },
  {
    name: 'Collections',
    slug: 'collections',
    subcategories: [
      { name: 'Corduroy Collection', slug: 'corduroy' },
      { name: 'Out There Gear', slug: 'out-there' },
      { name: 'The Holiday Outfitting', slug: 'holiday' },
      { name: 'The Cold Weather', slug: 'cold' }
    ]
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subcategories: [
      { name: 'Hats', slug: 'hats' },
      { name: 'Beanies', slug: 'beanies' },
      { name: 'Socks', slug: 'socks' },
      { name: 'Towels', slug: 'towels' }
    ]
  }
];

