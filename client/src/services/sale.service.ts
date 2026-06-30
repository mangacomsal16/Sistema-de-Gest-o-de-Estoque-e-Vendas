import { api } from './api';
import type { Paginated, PaymentMethod, Sale } from '../types';

export interface SalePayload {
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

export const saleService = {
  async list(params: { page?: number; pageSize?: number } = {}) {
    const { data } = await api.get<Paginated<Sale>>('/sales', { params });
    return data;
  },
  async create(payload: SalePayload) {
    const { data } = await api.post<Sale>('/sales', payload);
    return data;
  },
};
