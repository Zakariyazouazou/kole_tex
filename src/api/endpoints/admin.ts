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
  OrderStatus,
  PaginatedResponse,
  SyncLog,
  SyncStatusResponse,
} from '@/lib/admin-api';

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const getDashboardStats = () =>
  apiClient.get<DashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD).then((r) => r.data);

// ─── Users ─────────────────────────────────────────────────────────────────

export const getUsers = (page = 1, limit = 20) =>
  apiClient
    .get<PaginatedResponse<AdminUser>>(`${API_ENDPOINTS.ADMIN.USERS.LIST}?page=${page}&limit=${limit}`)
    .then((r) => r.data);

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

export const getSyncStatus = () =>
  apiClient.get<SyncStatusResponse>(API_ENDPOINTS.ADMIN.SYNC.STATUS).then((r) => r.data);

export const getLastSyncStatus = () =>
  apiClient
    .get<SyncStatusResponse>(API_ENDPOINTS.ADMIN.SYNC.SYNC_STATUS)
    .then((r) => r.data);

export const triggerFullSync = () =>
  apiClient
    .post<{ message: string }>(API_ENDPOINTS.ADMIN.SYNC.FULL)
    .then((r) => r.data);

export const triggerIncrementalSync = (modifiedSince: string) =>
  apiClient
    .post<{ message: string }>(API_ENDPOINTS.ADMIN.SYNC.INCREMENTAL, { modifiedSince })
    .then((r) => r.data);

export const triggerDeletedSync = (deletedSince: string) =>
  apiClient
    .post<{ message: string }>(API_ENDPOINTS.ADMIN.SYNC.DELETED, { deletedSince })
    .then((r) => r.data);

export const getSyncLogs = (page = 1, limit = 20) =>
  apiClient
    .get<PaginatedResponse<SyncLog>>(`${API_ENDPOINTS.ADMIN.SYNC.LOGS}?page=${page}&limit=${limit}`)
    .then((r) => r.data);
