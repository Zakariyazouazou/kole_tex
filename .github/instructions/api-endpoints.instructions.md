---
description: "Use when adding, editing, or consuming API endpoints in this project. Covers endpoint constants, namespace usage (publicApi / protectedApi / adminApi), response mapping, and admin vs user access patterns."
applyTo: "src/api/**"
---

# API Layer Conventions

## Structure Overview

```
src/api/
  client.ts                  ← Axios instance with Bearer interceptor + silent refresh
  index.ts                   ← Re-exports the three namespaces + client helpers
  endpoints.constants.ts     ← ALL URL strings live here — never hardcode a path
  endpoints/
    public.ts                ← Unauthenticated calls (login, register, public products…)
    protected.ts             ← Authenticated user calls (addresses, profile, orders…)
    admin.ts                 ← Admin-only calls (all admin CRUD)
src/lib/admin-api.ts         ← Types ONLY — no functions, no fetch calls
src/types/
  auth.types.ts              ← User, AuthResponse, LoginPayload…
  address.types.ts           ← Address, CreateAddressPayload, UpdateAddressPayload…
```

---

## Step 1 — Add the URL to `endpoints.constants.ts`

Every URL string **must** live in `API_ENDPOINTS` in `src/api/endpoints.constants.ts`.
Never paste a raw string like `'/some/path'` inside an endpoint function.

```ts
// src/api/endpoints.constants.ts
export const API_ENDPOINTS = {
  ADMIN: {
    PRODUCTS: {
      LIST: '/products',              // static path
      BY_ID: (id: string) => `/products/${id}`,  // dynamic path — use a function
    },
  },
} as const;
```

Rules:
- Static path → plain string value
- Dynamic path (with an id or param) → arrow function returning a string
- Group by domain (`AUTH`, `ME`, `ADDRESSES`, `ADMIN.*`)

---

## Step 2 — Add the function to the correct endpoint file

| Caller | File |
|--------|------|
| No auth needed | `src/api/endpoints/public.ts` |
| Any logged-in user | `src/api/endpoints/protected.ts` |
| ADMIN role only | `src/api/endpoints/admin.ts` |

### Pattern for a simple GET (no pagination)

```ts
import { API_ENDPOINTS } from '../endpoints.constants';

export const getProduct = (id: string) =>
  apiClient
    .get<Product>(API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id))
    .then((r) => r.data);
```

### Pattern for a paginated GET

Most list endpoints return a non-standard shape from the backend.
Always check what the backend actually returns and map it explicitly.

```ts
// Backend returns: { products: Product[], total: number, page: number, limit: number }
export const getAdminProducts = (page = 1, limit = 20) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiClient
    .get<{ products: Product[]; total: number; page: number; limit: number }>(
      `${API_ENDPOINTS.ADMIN.PRODUCTS.LIST}?${params}`
    )
    .then((r) => ({
      data: r.data.products,   // ← normalize to 'data' key for consistent access
      total: r.data.total,
      page: r.data.page,
      limit: r.data.limit,
    }));
};
```

> ⚠️ Do **not** assume the list key is `data`. Confirm against the actual backend response
> (e.g., addresses uses `{ addresses: [] }`, check each resource individually).

### Pattern for POST / PATCH / DELETE

```ts
export const createProduct = (data: CreateProductPayload) =>
  apiClient.post<Product>(API_ENDPOINTS.ADMIN.PRODUCTS.LIST, data).then((r) => r.data);

export const updateProduct = (id: string, data: Partial<Product>) =>
  apiClient.patch<Product>(API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id), data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  apiClient.delete<void>(API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id)).then(() => undefined);
```

---

## Step 3 — Add the type to the correct types file

- Response types that are **admin-only** → `src/lib/admin-api.ts` (types only, no functions)
- Response types used by normal users → `src/types/address.types.ts` or a new `src/types/<domain>.types.ts`
- Payload types (POST/PATCH body) → same file as the response type

```ts
// src/lib/admin-api.ts  ← types only
export interface AdminProduct {
  catalogReference: string;
  name: string;
  price: number;
}
```

---

## Step 4 — Consume via the namespace in components

Always import from `@/api`, never from the endpoint files directly.

```ts
import { adminApi, protectedApi, publicApi } from '@/api';

// In a component / hook:
const product = await adminApi.getProduct(id);
const addresses = await protectedApi.getMyAddresses();
const products = await publicApi.getProducts();
```

---

## Admin vs User access on the same resource

Some resources share endpoints between admin and user:

| Operation | URL | Who can call |
|-----------|-----|-------------|
| List all (any user) | `GET /addresses/admin/all` | Admin only |
| Get by id | `GET /addresses/:id` | Admin + owner user |
| Update | `PATCH /addresses/:id` | Admin + owner user |
| Delete | `DELETE /addresses/:id` | Admin + owner user |

In `endpoints.constants.ts` the shared path lives under `ADDRESSES.BY_ID`.
The admin-only list path lives under `ADMIN.ADDRESSES.ALL`.
Both `admin.ts` and `protected.ts` can call `ADDRESSES.BY_ID` — the backend enforces role via JWT.

---

## Error handling in components

Always use `extractApiError` from `@/lib/extractApiError` inside `catch` blocks.
Never access `error.message` or `error.response.data` directly.

```ts
import { extractApiError } from '@/lib/extractApiError';

try {
  await adminApi.deleteProduct(id);
} catch (err) {
  setError(extractApiError(err));  // returns a clean string
}
```

---

## Checklist when adding a new endpoint

- [ ] URL added to `API_ENDPOINTS` in `endpoints.constants.ts`
- [ ] Function added to the correct file (`public.ts` / `protected.ts` / `admin.ts`)
- [ ] Response type confirmed against real backend response (check list key name)
- [ ] Type defined in `src/lib/admin-api.ts` or `src/types/`
- [ ] Called via `adminApi.*` / `protectedApi.*` / `publicApi.*` in components
- [ ] Errors caught with `extractApiError`
