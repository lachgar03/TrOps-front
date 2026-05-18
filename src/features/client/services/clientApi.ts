import api from '@/config/axios';
import type { ClientResponse, ClientRequest } from '../types/client.types';
import type { Page } from '@/common/types/api.types';

export const clientApi = {
  fetchClients: async (page = 0, size = 10): Promise<Page<ClientResponse>> => {
    const response = await api.get<Page<ClientResponse>>(`/clients?page=${page}&size=${size}`);
    return response.data;
  },

  getClient: async (id: string): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(`/clients/${id}`);
    return response.data;
  },

  createClient: async (data: ClientRequest): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>('/clients', data);
    return response.data;
  },

  updateClient: async (id: string, data: ClientRequest): Promise<ClientResponse> => {
    const response = await api.put<ClientResponse>(`/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
