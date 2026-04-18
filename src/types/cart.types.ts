export interface ServerCartProduct {
  id: string;
  catalogReference: string;
  brand: string;
}

export interface ServerCartColor {
  colorCode: string;
  hexColor: string | null;
}

export interface ServerCartSku {
  sizeLabel: string | null;
  price: number;
  publicPrice: number | null;
  saleState: string;
  isDiscontinued: boolean;
  color: ServerCartColor;
  product: ServerCartProduct;
  image: string | null;
}

export interface ServerCartItem {
  id: string; // This is the unique CartItem ID (DB row ID)
  skuId: string; // The SKU identifier used for adding/updating
  quantity: number;
  sku: ServerCartSku;
}

export interface ServerCart {
  items: ServerCartItem[];
  total: number;
}

export interface AddToCartPayload {
  skuId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface MergeCartPayload {
  items: Array<{
    skuId: string;
    quantity: number;
  }>;
}
