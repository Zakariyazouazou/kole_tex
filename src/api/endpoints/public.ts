import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints.constants';
import type {
  AuthResponse,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';
import type {
  GetProductsParams,
  GetFiltersParams,
  SearchProductsParams,
  ProductListResponse,
  ProductFiltersResponse,
  ProductDetail,
} from '@/types/product.types';

export function register(data: RegisterPayload): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>('/auth/register', data)
    .then((r) => r.data);
}

export function verifyEmail(data: VerifyEmailPayload): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>('/auth/verify-email', data)
    .then((r) => r.data);
}

export function resendVerification(data: {
  email: string;
}): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>('/auth/resend-verification', data)
    .then((r) => r.data);
}

export function login(data: LoginPayload): Promise<AuthResponse> {
  return apiClient
    .post<AuthResponse>('/auth/login', data)
    .then((r) => r.data);
}

export function refresh(): Promise<{ accessToken: string }> {
  return apiClient
    .post<{ accessToken: string }>('/auth/refresh')
    .then((r) => r.data);
}

export function forgotPassword(data: {
  email: string;
}): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>('/auth/forgot-password', data)
    .then((r) => r.data);
}

export function resetPassword(data: {
  token: string;
  newPassword: string;
}): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>('/auth/reset-password', data)
    .then((r) => r.data);
}

export function googleAuth(data: {
  idToken: string;
}): Promise<AuthResponse> {
  return apiClient
    .post<AuthResponse>('/auth/google', data)
    .then((r) => r.data);
}

// ─── Products (public — no token required) ────────────────────────────────────

export function getProducts(params: GetProductsParams): Promise<ProductListResponse> {
  return apiClient
    .get<{ data: ProductListResponse['data']; pagination: ProductListResponse['pagination'] }>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params }
    )
    .then((r) => r.data);
}

export function getProductFilters(
  params: GetFiltersParams
): Promise<ProductFiltersResponse> {
  return apiClient
    .get<{
      colors: { hex: string; name?: string; label?: string; count: number }[];
      sizes: { label: string; count: number }[];
      brands: { name?: string; label?: string; count: number }[];
      priceRange: { min: number; max: number };
      organic?: { count: number };
      recycled?: { count: number };
    }>(API_ENDPOINTS.PRODUCTS.FILTERS, { params })
    .then((r) => {
      const raw = r.data;
      return {
        ...raw,
        colors: raw.colors.map((c) => ({ hex: c.hex, label: c.label ?? c.name ?? '', count: c.count })),
        brands: raw.brands.map((b) => ({ label: b.label ?? b.name ?? '', count: b.count })),
      };
    });
}

export function searchProducts(
  params: SearchProductsParams
): Promise<ProductListResponse> {
  return apiClient
    .get<{ data: ProductListResponse['data']; pagination: ProductListResponse['pagination'] }>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      { params }
    )
    .then((r) => r.data);
}

export function getProductDetail(
  catalogReference: string,
  lang: string
): Promise<ProductDetail> {
  return apiClient
    .get<ProductDetail>(API_ENDPOINTS.PRODUCTS.BY_CATALOG_REF(catalogReference), {
      params: { lang },
    })
    .then((r) => r.data);
}

