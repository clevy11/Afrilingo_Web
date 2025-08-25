import { httpClient } from '@/utils/httpClient';

export interface ProfileNameResponse {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserProfile {
  id?: number;
  country?: string;
  firstLanguage?: string;
  reasonToLearn?: string;
  profilePicture?: string;
  dailyReminders?: boolean;
  dailyGoalMinutes?: number;
  preferredLearningTime?: string | null;
  languagesToLearn?: Array<{ id: number; name: string; code: string }>;
}

interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
}

export const profileService = {
  async getCurrentProfile(): Promise<UserProfile> {
    const res = await httpClient.get<UserProfile | ApiResponse<UserProfile>>('/profile');
    const api = res as ApiResponse<UserProfile>;
    return api.data ?? (res as UserProfile);
  },

  async getName(): Promise<ProfileNameResponse> {
    const res = await httpClient.get<ProfileNameResponse | ApiResponse<ProfileNameResponse>>('/profile/name');
    const api = res as ApiResponse<ProfileNameResponse>;
    return api.data ?? (res as ProfileNameResponse);
  },
};
