/**
 * Admin type definitions.
 * API functions live in src/api/endpoints/admin.ts (uses the shared apiClient).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type SyncType = 'upsert' | 'deleted';
export type SyncStatus = 'running' | 'success' | 'failed';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CUSTOMER' | 'ADMIN';
  isEmailVerified: boolean;
  provider: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  status: OrderStatus;
  totalPrice: number;
  isPaid: boolean;
  myOrderId?: string;
  toptexOrderId?: string;
  createdAt: string;
}

export interface AdminAddress {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface AdminCart {
  cartId: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  itemCount: number;
  totalValue: number;
}

export interface AdminCartDetail extends AdminCart {
  items: {
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface AdminReview {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminProduct {
  catalogReference: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  colors: string[];
  sizes: string[];
}

export interface AdminCategory {
  id: string;
  name: string;
  parentId?: string;
  children?: AdminCategory[];
}

export interface SyncLog {
  id: string;
  type: SyncType;
  status: SyncStatus;
  totalPages?: number;
  processedItems?: number;
  failedItems?: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface SyncStatusResponse {
  apiConnectivity: 'ok' | 'error';
  lastSync?: { status: SyncStatus; completedAt?: string };
}

export interface DashboardStats {
  totalUsers: number;
  ordersByStatus: Record<OrderStatus, number>;
  activeCartsCount: number;
  recentOrders: AdminOrder[];
  latestSyncStatus: SyncStatus | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

