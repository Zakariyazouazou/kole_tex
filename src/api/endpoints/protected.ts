import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints.constants';
import type { ChangePasswordPayload, MessageResponse, User } from '@/types/auth.types';
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '@/types/address.types';

export function logout(): Promise<void> {
  return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT).then(() => undefined);
}

export function changePassword(
  data: ChangePasswordPayload
): Promise<MessageResponse> {
  return apiClient
    .post<MessageResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
    .then((r) => r.data);
}

// ─── Addresses (User) ─────────────────────────────────────────────────────────

export function getMyAddresses(): Promise<Address[]> {
  return apiClient.get<Address[]>(API_ENDPOINTS.ADDRESSES.LIST).then((r) => r.data);
}

export function getAddress(id: string): Promise<Address> {
  return apiClient.get<Address>(API_ENDPOINTS.ADDRESSES.BY_ID(id)).then((r) => r.data);
}

export function createAddress(data: CreateAddressPayload): Promise<Address> {
  return apiClient.post<Address>(API_ENDPOINTS.ADDRESSES.LIST, data).then((r) => r.data);
}

export function updateAddress(
  id: string,
  data: UpdateAddressPayload
): Promise<Address> {
  return apiClient.patch<Address>(API_ENDPOINTS.ADDRESSES.BY_ID(id), data).then((r) => r.data);
}

export function deleteAddress(id: string): Promise<void> {
  return apiClient.delete<void>(API_ENDPOINTS.ADDRESSES.BY_ID(id)).then(() => undefined);
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function getMe(): Promise<User> {
  return apiClient.get<User>(API_ENDPOINTS.ME.PROFILE).then((r) => r.data);
}

export function updateMe(data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}): Promise<User> {
  return apiClient.patch<User>(API_ENDPOINTS.ME.PROFILE, data).then((r) => r.data);
}

export function updateMeEmail(data: {
  newEmail: string;
  password: string;
}): Promise<void> {
  return apiClient.patch<void>(API_ENDPOINTS.ME.EMAIL, data).then(() => undefined);
}

export function updateMePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  return apiClient
    .patch<void>(API_ENDPOINTS.ME.PASSWORD, data)
    .then(() => undefined);
}
