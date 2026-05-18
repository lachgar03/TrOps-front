/**
 * Dashboard types — exactly aligned with DashboardSummaryDTO.java
 */
export interface DashboardSummary {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  activeMissions: number;
  totalVehicles: number;
  vehiclesUnderMaintenance: number;
  totalClients: number;
  missionsAtLossCount: number;
  topVehicles: VehicleInsight[];
  topClients: ClientInsight[];
  missionsAtLoss: MissionInsight[];
}

export interface VehicleInsight {
  vehicleId: string;
  registrationNumber: string;
  totalRevenues: number;
  totalCosts: number;
  totalProfit: number;
}

export interface ClientInsight {
  clientId: string;
  clientName: string;
  totalRevenues: number;
  totalCosts: number;
  totalProfit: number;
}

export interface MissionInsight {
  missionId: string;
  vehicleRegistration: string;
  clientName: string;
  revenues: number;
  costs: number;
  profit: number;
  profitMargin: number;
}
