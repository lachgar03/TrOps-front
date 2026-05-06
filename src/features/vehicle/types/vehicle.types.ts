export interface VehicleResponse {
  id: string;
  registrationNumber: string;
  isUnderMaintenance: boolean;
}

export interface VehicleFinancialSummary {
  totalRevenue: number;
  totalCost: number;
  profit: number;
}
