import api from "@/config/axios";
import type { MissionRequest, MissionResponse } from "../types/mission.types";

type MissionListPayload =
  | MissionResponse[]
  | { data?: MissionResponse[] }
  | { content?: MissionResponse[] }
  | { items?: MissionResponse[] };

const isMissionArray = (value: unknown): value is MissionResponse[] => {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  return value.every(
    (v) =>
      typeof v === "object" &&
      v !== null &&
      "id" in (v as any) &&
      "createdAt" in (v as any),
  );
};

const findMissionArray = (input: unknown, depth = 3): MissionResponse[] => {
  if (isMissionArray(input)) return input;
  if (depth <= 0 || typeof input !== "object" || input === null) return [];

  for (const val of Object.values(input as Record<string, unknown>)) {
    if (isMissionArray(val)) return val as MissionResponse[];
  }

  for (const val of Object.values(input as Record<string, unknown>)) {
    const found = findMissionArray(val, depth - 1);
    if (found.length) return found;
  }

  return [];
};

const extractMissionList = (payload: MissionListPayload): MissionResponse[] => {
  if (isMissionArray(payload)) return payload as MissionResponse[];
  if (payload && Array.isArray((payload as any).data))
    return (payload as any).data;
  if (payload && Array.isArray((payload as any).content))
    return (payload as any).content;
  if (payload && Array.isArray((payload as any).items))
    return (payload as any).items;
  return findMissionArray(payload) ?? [];
};

export const missionApi = {
  createMission: async (data: MissionRequest): Promise<MissionResponse> => {
    const response = await api.post<MissionResponse>("/missions", data);
    return response.data;
  },

  getMissions: async (): Promise<MissionResponse[]> => {
    const response = await api.get<MissionListPayload>("/missions");
    return extractMissionList(response.data);
  },
};
