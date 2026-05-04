import api from '@/config/axios';
import type { LoginRequest, JwtResponse, RegisterCompanyRequest } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/login', credentials);
    return response.data;
  },
  
  registerCompany: async (data: RegisterCompanyRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/register-company', data);
    return response.data;
  }
};