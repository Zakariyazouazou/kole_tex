/**
 * Centralized API endpoint URL constants.
 * Import from here instead of hardcoding paths in endpoint files.
 */
export const API_ENDPOINTS = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  AUTH: {
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // ─── Current user (me) ───────────────────────────────────────────────────
  ME: {
    PROFILE: '/users/me',
    EMAIL: '/users/me/email',
    PASSWORD: '/users/me/password',
  },

  // ─── User addresses ──────────────────────────────────────────────────────
  ADDRESSES: {
    LIST: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },

  // ─── Public products ─────────────────────────────────────────────────────
  PRODUCTS: {
    LIST: '/products',
    FILTERS: '/products/filters',
    SEARCH: '/products/search',
    BY_CATALOG_REF: (catalogReference: string) => `/products/${catalogReference}`,
  },

  // ─── Admin ───────────────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: '/admin/dashboard',

    USERS: {
      LIST: '/users',
      BY_ID: (id: string) => `/users/${id}`,
    },

    ORDERS: {
      ALL: '/orders/admin/all',
      STATUS: (id: string) => `/orders/admin/${id}/status`,
      FORWARD: (id: string) => `/orders/admin/${id}/forward`,
      TOPTEX_STATUS: (id: string) => `/orders/admin/${id}/toptex`,
      TOPTEX_ALL: '/orders/admin/toptex',
    },

    ADDRESSES: {
      ALL: '/addresses/admin/all',   // admin-only: list all users' addresses
      BY_ID: (id: string) => `/addresses/${id}`, // shared with user endpoint
    },

    CARTS: {
      ALL: '/cart/admin/all',
      BY_USER: (userId: string) => `/cart/admin/${userId}`,
    },

    REVIEWS: {
      LIST: '/reviews',
      BY_ID: (id: string) => `/reviews/${id}`,
    },

    PRODUCTS: {
      LIST: '/products',
      FILTERS: '/products/filters',
    },

    CATEGORIES: '/categories',

    SYNC: {
      STATUS: '/sync/status',
      SYNC_STATUS: '/sync/sync-status',
      FULL: '/sync/full',
      INCREMENTAL: '/sync/incremental',
      DELETED: '/sync/deleted',
      LOGS: '/sync/logs',
    },
  },
} as const;
