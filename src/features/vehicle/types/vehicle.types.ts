export interface VehicleResponse {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  currentMileage: number;
  isUnderMaintenance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFinancialSummary {
  vehicleId: string;
  registrationNumber: string;
  totalRevenues: number;
  totalCosts: number;
  totalProfit: number;
}

export interface VehicleRequest {
  registrationNumber: string;
  brand: string;
  model: string;
  currentMileage: number;
}

export interface DocumentResponse {
  id: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expirationDate: string;
}

export interface DocumentRequest {
  documentType: 'INSURANCE' | 'TECHNICAL_VISIT' | 'REGISTRATION';
  documentNumber: string;
  issueDate: string;
  expirationDate: string;
}
