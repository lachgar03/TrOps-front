import api from '@/config/axios';
import type { MaintenanceResponse, MaintenanceRequest } from '../types/maintenance.types';
import type { MaintenanceStatus } from '@/common/types/enums';
import type { Page } from '@/common/types/api.types';

export const maintenanceApi = {
  fetchAll: async (page = 0, size = 10): Promise<Page<MaintenanceResponse>> => {
    const response = await api.get<Page<MaintenanceResponse>>(`/maintenance?page=${page}&size=${size}`);
    return response.data;
  },

  create: async (data: MaintenanceRequest): Promise<MaintenanceResponse> => {
    const response = await api.post<MaintenanceResponse>('/maintenance', data);
    return response.data;
  },

  updateStatus: async (id: string, status: MaintenanceStatus): Promise<MaintenanceResponse> => {
    const response = await api.patch<MaintenanceResponse>(`/maintenance/${id}/status`, { status });
    return response.data;
  },
};
