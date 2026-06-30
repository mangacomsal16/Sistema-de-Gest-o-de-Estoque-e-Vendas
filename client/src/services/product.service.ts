import { api } from './api';
import type { Paginated, Product, ProductFilters } from '../types';

export interface ProductPayload {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  costPrice?: number | null;
  stock: number;
  minStock: number;
  categoryId: string;
}

export const productService = {
  async list(filters: ProductFilters) {
    const { data } = await api.get<Paginated<Product>>('/products', { params: filters });
    return data;
  },
  async create(payload: ProductPayload) {
    const { data } = await api.post<Product>('/products', payload);
    return data;
  },
  async update(id: string, payload: ProductPayload) {
    const { data } = await api.put<Product>(`/products/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/products/${id}`);
  },
};
