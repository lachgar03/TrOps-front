import type { MaintenanceStatus } from '@/common/types/enums';

export interface MaintenanceResponse {
  id: string;
  vehicleId: string;
  vehicleRegistrationNumber: string;
  description: string;
  cost: number;
  mileageAtMaintenance: number;
  status: MaintenanceStatus;
  maintenanceDate: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  vehicleId: string;
  description: string;
  cost: number;
  mileageAtMaintenance: number;
  maintenanceDate: string;
}
