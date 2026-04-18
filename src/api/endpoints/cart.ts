import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints.constants';
import type {
  ServerCart,
  AddToCartPayload,
  UpdateCartItemPayload,
  MergeCartPayload,
} from '@/types/cart.types';

export function getCart(): Promise<ServerCart> {
  return apiClient.get<ServerCart>(API_ENDPOINTS.CART.GET).then((r) => r.data);
}

export function addItemToCart(data: AddToCartPayload): Promise<ServerCart> {
  return apiClient.post<ServerCart>(API_ENDPOINTS.CART.ITEMS, data).then((r) => r.data);
}

export function updateCartItemQty(skuId: string, data: UpdateCartItemPayload): Promise<ServerCart> {
  return apiClient.patch<ServerCart>(API_ENDPOINTS.CART.ITEM(skuId), data).then((r) => r.data);
}

export function removeItemFromCart(skuId: string): Promise<ServerCart> {
  return apiClient.delete<ServerCart>(API_ENDPOINTS.CART.ITEM(skuId)).then((r) => r.data);
}

export function clearCart(): Promise<void> {
  return apiClient.delete<void>(API_ENDPOINTS.CART.CLEAR).then(() => undefined);
}

export function mergeGuestCart(data: MergeCartPayload): Promise<ServerCart> {
  return apiClient.post<ServerCart>(API_ENDPOINTS.CART.MERGE, data).then((r) => r.data);
}
