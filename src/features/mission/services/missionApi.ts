import api from "@/config/axios";
import type { MissionRequest, MissionResponse } from "../types/mission.types";
import type { Page } from "@/common/types/api.types";

export const missionApi = {
  createMission: async (data: MissionRequest): Promise<MissionResponse> => {
    const response = await api.post<MissionResponse>("/missions", data);
    return response.data;
  },

  getMissions: async (page = 0, size = 10): Promise<Page<MissionResponse>> => {
    const response = await api.get<Page<MissionResponse>>(`/missions?page=${page}&size=${size}`);
    return response.data;
  },
};
