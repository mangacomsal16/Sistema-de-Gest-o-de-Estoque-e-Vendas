import { api, tokenStore } from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    tokenStore.set(data.token);
    return data.user;
  },
  async me() {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
  logout() {
    tokenStore.clear();
  },
};
