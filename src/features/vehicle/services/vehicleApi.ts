import api from "../../../config/axios";
import type {
  VehicleResponse,
  VehicleFinancialSummary,
} from "../types/vehicle.types";

type VehicleListPayload =
  | VehicleResponse[]
  | { data?: VehicleResponse[] }
  | { content?: VehicleResponse[] }
  | { items?: VehicleResponse[] };

const isVehicleArray = (value: unknown): value is VehicleResponse[] => {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true; // allow empty arrays
  return value.every(
    (v) =>
      typeof v === "object" &&
      v !== null &&
      "id" in (v as any) &&
      "registrationNumber" in (v as any),
  );
};

const findVehicleArray = (input: unknown, depth = 3): VehicleResponse[] => {
  if (isVehicleArray(input)) return input;
  if (depth <= 0 || typeof input !== "object" || input === null) return [];

  // Check first-level object values for arrays
  for (const val of Object.values(input as Record<string, unknown>)) {
    if (isVehicleArray(val)) return val as VehicleResponse[];
  }

  // Recurse one level deeper to handle nested wrappers like { data: { content: [...] } }
  for (const val of Object.values(input as Record<string, unknown>)) {
    const found = findVehicleArray(val, depth - 1);
    if (found.length) return found;
  }

  return [];
};

const extractVehicleList = (payload: VehicleListPayload): VehicleResponse[] => {
  // fast paths
  if (isVehicleArray(payload)) return payload as VehicleResponse[];
  if (payload && Array.isArray((payload as any).data))
    return (payload as any).data;
  if (payload && Array.isArray((payload as any).content))
    return (payload as any).content;
  if (payload && Array.isArray((payload as any).items))
    return (payload as any).items;

  // fallback: try to find an array anywhere in the payload that looks like vehicles
  return findVehicleArray(payload) ?? [];
};

export const vehicleApi = {
  /**
   * Récupère la liste de tous les véhicules de la flotte.
   */
  fetchVehicles: async (): Promise<VehicleResponse[]> => {
    const response = await api.get<VehicleListPayload>("/vehicles");
    return extractVehicleList(response.data);
  },

  /**
   * Récupère le résumé financier agrégé d'un véhicule.
   */
  fetchVehicleFinancialSummary: async (
    id: string,
  ): Promise<VehicleFinancialSummary> => {
    const response = await api.get<VehicleFinancialSummary>(
      `/vehicles/${id}/financial-summary`,
    );
    return response.data;
  },
};
