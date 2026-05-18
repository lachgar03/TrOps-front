import api from '@/config/axios';
import type { ExpenseResponse, ExpenseRequest } from '../types/expense.types';
import type { Page } from '@/common/types/api.types';

export const expenseApi = {
  fetchExpenses: async (page = 0, size = 10): Promise<Page<ExpenseResponse>> => {
    const response = await api.get<Page<ExpenseResponse>>(`/expenses?page=${page}&size=${size}`);
    return response.data;
  },

  createExpense: async (data: ExpenseRequest): Promise<ExpenseResponse> => {
    const response = await api.post<ExpenseResponse>('/expenses', data);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
