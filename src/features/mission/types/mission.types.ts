export interface MissionRequest {
  vehicleId: string;
  clientId: string;
  revenues: number;
  costs: number;
}

export interface MissionResponse {
  id: string;
  vehicleId: string;
  vehicleRegistrationNumber: string;
  clientId: string;
  clientName: string;
  revenues: number;
  costs: number;
  profit: number;
  createdAt: string;
}
