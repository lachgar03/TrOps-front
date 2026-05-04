import api from '@/config/axios';
import type { MissionRequest, MissionResponse } from '../types/mission.types';

export const missionApi = {
  createMission: async (data: MissionRequest): Promise<MissionResponse> => {
    const response = await api.post<MissionResponse>('/missions', data);
    return response.data;
  },

  getMissions: async (): Promise<MissionResponse[]> => {
    const response = await api.get<MissionResponse[]>('/missions');
    return response.data;
  }
};
