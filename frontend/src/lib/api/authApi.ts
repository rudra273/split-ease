// src/lib/api/authApi.ts
import { apiClient } from './apiClient';
import type { AuthTokens, LoginCredentials, RegisterCredentials, Profile } from '../types/auth';

export const authApi = {
login: (credentials: LoginCredentials) =>
    apiClient<AuthTokens>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
    }),

register: (credentials: RegisterCredentials) =>
    apiClient<AuthTokens>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(credentials),
    }),

logout: () =>
    apiClient('/auth/logout/', {
    method: 'POST',
    requireAuth: true,
    }),

getProfile: () =>
    apiClient<Profile>('/auth/profile/', {
    requireAuth: true,
    }),

refreshToken: (refreshToken: string) =>
    apiClient<AuthTokens>('/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
    }),
};
