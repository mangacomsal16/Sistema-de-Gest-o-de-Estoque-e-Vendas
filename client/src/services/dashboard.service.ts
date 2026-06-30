import { api } from './api';
import type { DashboardStats } from '../types';

export const dashboardService = {
  async getStats() {
    const { data } = await api.get<DashboardStats>('/dashboard/stats');
    return data;
  },
};
