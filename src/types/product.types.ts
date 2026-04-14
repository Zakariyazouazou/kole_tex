// ─── Product list item (GET /products and GET /products/search) ───────────────
export interface ProductListItem {
  id: string;
  catalogReference: string;
  brand: string;
  name: string;
  mainImage: string | null;
  minPrice: number | null;
  organic: boolean;
  recycled: boolean;
  colorsCount: number;
  colors: {
    colorId: string;
    colorCode: string;
    hexColor: string | null;
    colorName: string;
  }[];
  category: { id: string; slug: string; name: string } | null;
}

// ─── Pagination wrapper ───────────────────────────────────────────────────────
export interface ProductListResponse {
  data: ProductListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── SKU ─────────────────────────────────────────────────────────────────────
export interface ProductSku {
  id: string;
  sku: string;
  ean: string | null;
  sizeLabel: string;
  price: number;
  publicPrice: number | null;
  isNew: boolean;
  isDiscontinued: boolean;
}

// ─── Color with packshots ─────────────────────────────────────────────────────
export interface ProductColor {
  id: string;
  colorCode: string;
  hexColor: string | null;
  colorName: string;
  pantone: string | null;
  packshots: { id: string; angleName: string; urlImage: string }[];
  skus: ProductSku[];
}

// ─── Full product detail (GET /products/:catalogReference) ────────────────────
export interface ProductDetail {
  id: string;
  catalogReference: string;
  brand: string;
  name: string;
  description: string;
  composition: string;
  weight: number | null;
  gender: string | null;
  labelType: string | null;
  organic: boolean;
  recycled: boolean;
  vegan: boolean;
  saleState: string;
  images: { id: string; urlImage: string; isMain: boolean }[];
  colors: ProductColor[];
  category: { id: string; slug: string; name: string } | null;
}

// ─── Filters response (GET /products/filters) ─────────────────────────────────
export interface ProductFiltersResponse {
  sizes: { label: string; count: number }[];
  colors: { hex: string; label: string; count: number }[];
  brands: { label: string; count: number }[];
  priceRange: { min: number; max: number };
  organic?: { count: number };
  recycled?: { count: number };
}

// ─── Categories and Subcategories ─────────────────────────────────────────────
export interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subcategories: Subcategory[];
}

export interface CategoriesResponse {
  data: Category[];
}

// ─── Query param types ────────────────────────────────────────────────────────
export interface GetProductsParams {
  lang: string;
  categorySlug?: string;
  subCategorySlug?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  recycled?: boolean;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
}

export type GetFiltersParams = Omit<GetProductsParams, 'page' | 'limit' | 'sortBy'> & {
  q?: string;
};

export interface SearchProductsParams {
  lang: string;
  q: string;
  page?: number;
  limit?: number;
}
