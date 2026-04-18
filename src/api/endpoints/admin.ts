import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints.constants';
import type {
  AdminAddress,
  AdminCart,
  AdminCartDetail,
  AdminCategory,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminUser,
  DashboardStats,
  HardUpsertResponse,
  OrderStatus,
  PaginatedResponse,
  SyncLogDetail,
  SyncLogsResponse,
  SyncOverallStatus,
  ToptexConnectionStatus,
} from '@/lib/admin-api';
import type { QuoteListResponse, QuoteRequest, QuoteStatus } from '@/types/quote.types';

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const getDashboardStats = () =>
  apiClient.get<DashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD).then((r) => r.data);

// ─── Users ─────────────────────────────────────────────────────────────────

export const getUsers = (page = 1, limit = 20, search?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  return apiClient
    .get<{ users: AdminUser[]; total: number; page: number; limit: number }>(
      `${API_ENDPOINTS.ADMIN.USERS.LIST}?${params}`
    )
    .then((r) => ({
      data: r.data.users,
      total: r.data.total,
      page: r.data.page,
      limit: r.data.limit,
      totalPages: Math.ceil(r.data.total / r.data.limit),
    }));
};

export const getUserById = (id: string) =>
  apiClient.get<AdminUser>(API_ENDPOINTS.ADMIN.USERS.BY_ID(id)).then((r) => r.data);

export const updateUser = (
  id: string,
  data: Partial<
    Pick<AdminUser, 'firstName' | 'lastName' | 'phoneNumber' | 'role'>
  >
) =>
  apiClient
    .patch<AdminUser>(API_ENDPOINTS.ADMIN.USERS.BY_ID(id), data)
    .then((r) => r.data);

export const deleteUser = (id: string) =>
  apiClient.delete<void>(API_ENDPOINTS.ADMIN.USERS.BY_ID(id)).then(() => undefined);

// ─── Orders ────────────────────────────────────────────────────────────────

export const getAllOrders = (
  page = 1,
  limit = 20,
  status?: OrderStatus,
  userId?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set('status', status);
  if (userId) params.set('userId', userId);
  return apiClient
    .get<PaginatedResponse<AdminOrder>>(`${API_ENDPOINTS.ADMIN.ORDERS.ALL}?${params}`)
    .then((r) => r.data);
};

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  apiClient
    .patch<AdminOrder>(API_ENDPOINTS.ADMIN.ORDERS.STATUS(id), { status })
    .then((r) => r.data);

export const forwardOrderToToptex = (id: string, testMode: boolean) =>
  apiClient
    .post<{ message: string }>(API_ENDPOINTS.ADMIN.ORDERS.FORWARD(id), { testMode })
    .then((r) => r.data);

export const getOrderToptexStatus = (id: string) =>
  apiClient
    .get<Record<string, unknown>>(API_ENDPOINTS.ADMIN.ORDERS.TOPTEX_STATUS(id))
    .then((r) => r.data);

export const getToptexOrders = () =>
  apiClient.get<unknown[]>(API_ENDPOINTS.ADMIN.ORDERS.TOPTEX_ALL).then((r) => r.data);

// ─── Addresses ─────────────────────────────────────────────────────────────

export const getAllAddresses = (page = 1, limit = 20, userId?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (userId) params.set('userId', userId);
  return apiClient
    .get<{ addresses: AdminAddress[]; total: number; page: number; limit: number }>(
      `${API_ENDPOINTS.ADMIN.ADDRESSES.ALL}?${params}`
    )
    .then((r) => ({
      data: r.data.addresses,
      total: r.data.total,
      page: r.data.page,
      limit: r.data.limit,
    }));
};

export const getAddress = (id: string) =>
  apiClient
    .get<AdminAddress>(API_ENDPOINTS.ADMIN.ADDRESSES.BY_ID(id))
    .then((r) => r.data);

export const updateAddress = (
  id: string,
  data: Partial<
    Pick<
      AdminAddress,
      | 'fullName'
      | 'phoneNumber'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'state'
      | 'postalCode'
      | 'country'
      | 'isDefault'
    >
  >
) =>
  apiClient
    .patch<AdminAddress>(API_ENDPOINTS.ADMIN.ADDRESSES.BY_ID(id), data)
    .then((r) => r.data);

export const deleteAddress = (id: string) =>
  apiClient.delete<void>(API_ENDPOINTS.ADMIN.ADDRESSES.BY_ID(id)).then(() => undefined);

// ─── Carts ─────────────────────────────────────────────────────────────────

export const getAllCarts = (page = 1, limit = 20) =>
  apiClient
    .get<PaginatedResponse<AdminCart>>(
      `${API_ENDPOINTS.ADMIN.CARTS.ALL}?page=${page}&limit=${limit}`
    )
    .then((r) => r.data);

export const getUserCart = (userId: string) =>
  apiClient
    .get<AdminCartDetail>(API_ENDPOINTS.ADMIN.CARTS.BY_USER(userId))
    .then((r) => r.data);

// ─── Reviews ───────────────────────────────────────────────────────────────

export const getAllReviews = (page = 1, limit = 20) =>
  apiClient
    .get<PaginatedResponse<AdminReview>>(
      `${API_ENDPOINTS.ADMIN.REVIEWS.LIST}?page=${page}&limit=${limit}`
    )
    .then((r) => r.data);

export const deleteReview = (id: string) =>
  apiClient.delete<void>(API_ENDPOINTS.ADMIN.REVIEWS.BY_ID(id)).then(() => undefined);

// ─── Products ──────────────────────────────────────────────────────────────

export const getAdminProducts = (page = 1, limit = 20, search?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set('search', search);
  return apiClient
    .get<PaginatedResponse<AdminProduct>>(`${API_ENDPOINTS.ADMIN.PRODUCTS.LIST}?${params}`)
    .then((r) => r.data);
};

export const getProductFilters = () =>
  apiClient
    .get<Record<string, unknown>>(API_ENDPOINTS.ADMIN.PRODUCTS.FILTERS)
    .then((r) => r.data);

// ─── Categories ────────────────────────────────────────────────────────────

export const getCategories = () =>
  apiClient.get<AdminCategory[]>(API_ENDPOINTS.ADMIN.CATEGORIES).then((r) => r.data);

// ─── Sync ──────────────────────────────────────────────────────────────────

/** GET /sync/status — public endpoint, no auth needed */
export const getToptexConnectionStatus = () =>
  apiClient.get<ToptexConnectionStatus>(API_ENDPOINTS.ADMIN.SYNC.STATUS).then((r) => r.data);

/** GET /sync/sync-status — returns last run summary for each sync type */
export const getSyncOverallStatus = () =>
  apiClient.get<SyncOverallStatus>(API_ENDPOINTS.ADMIN.SYNC.SYNC_STATUS).then((r) => r.data);

/** POST /sync/hard-upsert — trigger full hard upsert; returns syncLogId */
export const triggerHardUpsert = (startPage = 1) =>
  apiClient
    .post<HardUpsertResponse>(`${API_ENDPOINTS.ADMIN.SYNC.HARD_UPSERT}?startPage=${startPage}`)
    .then((r) => r.data);

/** GET /sync/logs — paginated history of all sync runs */
export const getSyncLogs = (
  page = 1,
  limit = 20,
  type?: 'upsert' | 'deleted' | 'hard-upsert',
  status?: 'running' | 'success' | 'failed'
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) params.set('type', type);
  if (status) params.set('status', status);
  return apiClient
    .get<SyncLogsResponse>(`${API_ENDPOINTS.ADMIN.SYNC.LOGS}?${params}`)
    .then((r) => r.data);
};

/** GET /sync/logs/:id — single run detail / live progress tracking */
export const getSyncLogById = (id: string) =>
  apiClient
    .get<SyncLogDetail>(API_ENDPOINTS.ADMIN.SYNC.LOG_BY_ID(id))
    .then((r) => r.data);

// ─── Admin Quotes ───────────────────────────────────────────────────────────

export const getAdminQuotes = (page = 1, limit = 20, status?: QuoteStatus) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  return apiClient
    .get<QuoteListResponse>(`${API_ENDPOINTS.ADMIN.QUOTES.ALL}?${params}`)
    .then((r) => r.data);
};

export const getAdminQuoteById = (id: string) =>
  apiClient
    .get<QuoteRequest>(API_ENDPOINTS.ADMIN.QUOTES.BY_ID(id))
    .then((r) => r.data);

export const updateAdminQuoteStatus = (id: string, status: QuoteStatus) =>
  apiClient
    .patch<QuoteRequest>(API_ENDPOINTS.ADMIN.QUOTES.STATUS(id), { status })
    .then((r) => r.data);

export const updateAdminQuoteNote = (id: string, adminNote: string) =>
  apiClient
    .patch<QuoteRequest>(API_ENDPOINTS.ADMIN.QUOTES.NOTE(id), { adminNote })
    .then((r) => r.data);
