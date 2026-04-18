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

export type SyncType = 'upsert' | 'deleted' | 'hard-upsert';
export type SyncStatus = 'running' | 'success' | 'failed';

export interface ToptexConnectionData {
  username: string;
  token: string;
  expiry_time: string;
  expiry_time_timezone: string;
}

export interface ToptexConnectionStatus {
  status: 'success' | 'error';
  message: string;
  data?: ToptexConnectionData;
}

export interface SyncRunStatus {
  status: SyncStatus | null;
  startedAt: string | null;
  finishedAt: string | null;
  processedItems: number | null;
  failedItems: number | null;
}

export interface SyncOverallStatus {
  upsert: SyncRunStatus;
  deleted: SyncRunStatus;
  hardUpsert: SyncRunStatus;
  lastUpsertSyncDate: string | null;
  lastDeletedSyncDate: string | null;
  lastHardUpsertDate: string | null;
}

export interface SyncLogDetail {
  id: string;
  type: SyncType;
  status: SyncStatus;
  startedAt: string;
  finishedAt: string | null;
  processedItems: number;
  failedItems: number;
  totalPages: number;
  errorMessage: string | null;
  createdAt: string;
}

export interface SyncLogsResponse {
  data: SyncLogDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HardUpsertResponse {
  message: string;
  syncLogId: string;
}

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

/** @deprecated Use SyncLogDetail instead */
export type SyncLog = SyncLogDetail;
/** @deprecated Use ToptexConnectionStatus or SyncOverallStatus instead */
export type SyncStatusResponse = ToptexConnectionStatus;

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

