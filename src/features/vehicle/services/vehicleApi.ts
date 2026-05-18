import api from "../../../config/axios";
import type {
  VehicleResponse,
  VehicleFinancialSummary,
} from "../types/vehicle.types";
import type { Page } from "@/common/types/api.types";

export const vehicleApi = {
  /**
   * Récupère la liste paginée de tous les véhicules de la flotte.
   */
  fetchVehicles: async (page = 0, size = 100): Promise<Page<VehicleResponse>> => {
    const response = await api.get<Page<VehicleResponse>>(`/vehicles?page=${page}&size=${size}`);
    return response.data;
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
