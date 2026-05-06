import api from "../../../config/axios";
import type { AlertResponse } from "../types/alert.types";

type AlertListPayload =
  | AlertResponse[]
  | { data?: AlertResponse[] }
  | { content?: AlertResponse[] }
  | { items?: AlertResponse[] };

const isAlertArray = (value: unknown): value is AlertResponse[] => {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  return value.every(
    (v) => typeof v === "object" && v !== null && "id" in (v as any),
  );
};

const findAlertArray = (input: unknown, depth = 3): AlertResponse[] => {
  if (isAlertArray(input)) return input;
  if (depth <= 0 || typeof input !== "object" || input === null) return [];
  for (const val of Object.values(input as Record<string, unknown>)) {
    if (isAlertArray(val)) return val as AlertResponse[];
  }
  for (const val of Object.values(input as Record<string, unknown>)) {
    const found = findAlertArray(val, depth - 1);
    if (found.length) return found;
  }
  return [];
};

const extractAlertList = (payload: AlertListPayload): AlertResponse[] => {
  if (isAlertArray(payload)) return payload as AlertResponse[];
  if (payload && Array.isArray((payload as any).data))
    return (payload as any).data;
  if (payload && Array.isArray((payload as any).content))
    return (payload as any).content;
  if (payload && Array.isArray((payload as any).items))
    return (payload as any).items;
  return findAlertArray(payload) ?? [];
};

export const alertApi = {
  /**
   * Récupère toutes les alertes actives (non résolues).
   */
  fetchActiveAlerts: async (): Promise<AlertResponse[]> => {
    const response = await api.get<AlertListPayload>("/alerts/active");
    return extractAlertList(response.data);
  },

  /**
   * Acquitte (résout) une alerte par son identifiant (UUID string).
   */
  resolveAlert: async (id: string): Promise<void> => {
    await api.post(`/alerts/${id}/resolve`);
  },
};
