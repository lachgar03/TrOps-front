// Réexport depuis la source centrale pour ne pas casser les imports existants.
export {
  MissionStatus,
  ProfitabilityScore,
} from '../../../common/types/enums';

export type {
  MissionStatus as MissionStatusType,
  ProfitabilityScore as ProfitabilityScoreType,
} from '../../../common/types/enums';

export interface MissionRequest {
  vehicleId: string;
  clientId: string;
  revenues: number;
  costs: number;
  status: import('../../../common/types/enums').MissionStatus;
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
  profitMargin: number;
  status: import('../../../common/types/enums').MissionStatus;
  profitabilityScore: import('../../../common/types/enums').ProfitabilityScore;
  createdAt: string;
}
