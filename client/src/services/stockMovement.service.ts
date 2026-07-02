import { api } from './api';
import type { StockMovement } from '../types';

export const stockMovementService = {
  async listByProduct(productId: string) {
    const { data } = await api.get<StockMovement[]>(`/products/${productId}/movements`);
    return data;
  },
};
