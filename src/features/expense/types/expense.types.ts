import type { ExpenseCategory } from '@/common/types/enums';

export interface ExpenseResponse {
  id: string;
  vehicleId: string | null;
  vehicleRegistrationNumber: string | null;
  missionId: string | null;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description: string | null;
  receiptUrl: string | null;
  createdAt: string;
}

export interface ExpenseRequest {
  vehicleId?: string;
  missionId?: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description?: string;
  receiptUrl?: string;
}
