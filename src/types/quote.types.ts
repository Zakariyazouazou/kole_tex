// ─── User quote stats ─────────────────────────────────────────────────────────

export interface UserQuoteStats {
  totalQuotes: number;
  pendingCount: number;
  deliveredCount: number;
  totalSpent: number;
}

// ─── Quote status ─────────────────────────────────────────────────────────────

export type QuoteStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

// ─── Quote item ───────────────────────────────────────────────────────────────

export interface QuoteItem {
  id: string;
  skuId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sku: {
    id: string;
    sku: string;
    sizeLabel: string;
    color: {
      colorName: string;
      colorCode: string;
    };
    product: {
      name: string;
      catalogReference: string;
    };
  };
}

// ─── Quote address snapshot ────────────────────────────────────────────────────

export interface QuoteAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

// ─── Quote request ────────────────────────────────────────────────────────────

export interface QuoteRequest {
  id: string;
  status: QuoteStatus;
  totalPrice: number;
  note?: string;
  adminNote?: string;
  isPaid: boolean;
  paidAt?: string | null;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  address: QuoteAddress;
  items: QuoteItem[];
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// ─── Create quote payload ─────────────────────────────────────────────────────

export interface CreateQuotePayload {
  addressId: string;
  items: { skuId: string; quantity: number }[];
  note?: string;
}

// ─── List response ────────────────────────────────────────────────────────────

export interface QuoteListResponse {
  data: QuoteRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
