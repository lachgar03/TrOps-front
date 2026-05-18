import api from '@/config/axios';
import type { DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
};
