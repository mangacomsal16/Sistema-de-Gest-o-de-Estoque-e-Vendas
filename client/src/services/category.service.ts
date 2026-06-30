import { api } from './api';
import type { Category } from '../types';

export const categoryService = {
  async list() {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
  async create(payload: { name: string; color?: string }) {
    const { data } = await api.post<Category>('/categories', payload);
    return data;
  },
};
