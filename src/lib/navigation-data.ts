export const navMenuItems = [
  { id: 'shop-by-categories', label: 'Shop By Categories', hasChevron: true, type: 'mega' as const },
  { id: 'new-arrivals', label: 'New Arrivals', hasChevron: true, type: 'dropdown' as const },
  { id: 'collections', label: 'Collections', hasChevron: true, type: 'dropdown' as const },
  { id: 'accessories', label: 'Accessories', hasChevron: false, type: 'link' as const, href: '/products?category=Electronics' },
  { id: 'sale', label: 'ON SALE', hasChevron: false, type: 'link' as const, href: '/products', highlight: true },
];

export const newArrivalsDropdown = {
  columns: [
    { title: 'Electronics', links: ['Shop All', 'Audio', 'Wearables', 'Accessories', 'Smart Home', 'Cameras'] },
    { title: 'Clothing', links: ['Shop All', 'Men', 'Women', 'Activewear', 'Outerwear', 'Denim'] },
    { title: 'Home & Kitchen', links: ['Shop All', 'Cookware', 'Organization', 'Decor', 'Bedding', 'Lighting'] },
    { title: 'Trending Now', links: ['Shop All', 'Headphones', 'Sweaters', 'Yoga Mats', 'Candles', 'Water Bottles'] },
    { title: 'Sports', links: ['Shop All', 'Yoga', 'Fitness', 'Running', 'Outdoor', 'Swimming'] },
    { title: 'Accessories', links: ['Shop All', 'Hats', 'Beanies', 'Socks', 'Towels', 'E-gift Card'] },
    { title: 'Campaigns', links: ['Shop All', 'Cashmere Sweaters', 'Surfing Favorites', 'Holiday Specials'] },
    { title: 'Brands', links: ['Shop All', 'Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance'] },
  ],
  promo: { badge: "WINTER'25", title: 'Saving $30 for Pre-Order', image: 'https://picsum.photos/seed/promo1/300/400' },
};

export const collectionsDropdown = {
  columns: [
    { title: 'Featured', links: ['Shop All', 'Best Sellers', 'New In', 'Editor Picks', 'Staff Favorites', 'Gift Ideas'] },
    { title: 'By Category', links: ['Shop All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Accessories'] },
    { title: 'Special Prices', links: ['Shop All', 'Under $50', 'Under $100', 'Sale Items', 'Clearance', 'Bundle Deals'] },
    { title: 'On Sale', links: ['Shop All', 'Headphones', 'Sweaters', 'Cookware', 'Yoga Mats', 'Speakers'] },
    { title: 'Seasonal', links: ['Shop All', 'Spring Picks', 'Summer Essentials', 'Fall Favorites', 'Winter Warmers'] },
    { title: 'Lifestyle', links: ['Shop All', 'Work From Home', 'Outdoor Living', 'Minimalist', 'Cozy Nights'] },
    { title: 'Gift Guide', links: ['Shop All', 'For Him', 'For Her', 'For Kids', 'Under $25'] },
  ],
  promo: { badge: 'SPRING 26', title: 'New Collection Available', image: 'https://picsum.photos/seed/promo2/300/400' },
};
