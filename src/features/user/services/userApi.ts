import api from '@/config/axios';
import type { UserResponse, UserCreateRequest } from '../types/user.types';

export const userApi = {
  fetchUsers: async (): Promise<UserResponse[]> => {
    // We assume backend returns a list of users for the company
    const response = await api.get<UserResponse[]>('/users');
    return response.data;
  },

  createUser: async (data: UserCreateRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/users', data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
