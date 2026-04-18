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
    LANGUAGE: '/users/me/language',
  },

  // ─── User addresses ──────────────────────────────────────────────────────
  ADDRESSES: {
    LIST: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },

  // ─── Cart (Protected) ───────────────────────────────────────────────────
  CART: {
    GET: '/cart',
    CLEAR: '/cart',
    ITEMS: '/cart/items',
    ITEM: (skuId: string) => `/cart/items/${skuId}`,
    MERGE: '/cart/merge',
  },

  // ─── Public products ─────────────────────────────────────────────────────
  PRODUCTS: {
    LIST: '/products',
    FILTERS: '/products/filters',
    SEARCH: '/products/search',
    BY_CATALOG_REF: (catalogReference: string) => `/products/${catalogReference}`,
  },

  // ─── Public categories ───────────────────────────────────────────────────
  CATEGORIES: '/categories',

  // ─── Quotes (User) ───────────────────────────────────────────────────────────
  QUOTES: {
    MY: '/quotes/my',
    MY_BY_ID: (id: string) => `/quotes/my/${id}`,
    CREATE: '/quotes',
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

    QUOTES: {
      ALL: '/quotes/admin/all',
      BY_ID: (id: string) => `/quotes/admin/${id}`,
      STATUS: (id: string) => `/quotes/admin/${id}/status`,
      NOTE: (id: string) => `/quotes/admin/${id}/note`,
      MARK_PAID: (id: string) => `/quotes/admin/${id}/mark-paid`,
    },

    ANALYTICS: {
      ACTION_QUEUE: '/analytics/action-queue',
      REVENUE: '/analytics/revenue',
      QUOTE_FUNNEL: '/analytics/quote-funnel',
      TOP_CUSTOMERS: '/analytics/top-customers',
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
      HARD_UPSERT: '/sync/hard-upsert',
      LOGS: '/sync/logs',
      LOG_BY_ID: (id: string) => `/sync/logs/${id}`,
    },
  },
} as const;
