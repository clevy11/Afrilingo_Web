import { httpClient } from '@/utils/httpClient';

export interface ProctorEvent {
  id: number;
  sessionId: number;
  userId?: number;
  userName?: string;
  eventType: string;
  eventTypeName?: string;
  description?: string;
  confidenceScore?: number;
  timestamp?: string;
}

export interface Certificate {
  id?: string;
  certificateId?: string;
  userId?: number;
  userEmail?: string;
  courseId?: number | string;
  courseName?: string;
  issuedAt?: string;
}

interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
}

export const certificationService = {
  async getAllProctorEvents(): Promise<ProctorEvent[]> {
    const res = await httpClient.get<ProctorEvent[] | ApiResponse<ProctorEvent[]>>('/certification/proctor-events');
    return (res as ApiResponse<ProctorEvent[]>).data ?? (res as ProctorEvent[]);
  },
  async getProctorEventsForUser(userId: number): Promise<ProctorEvent[]> {
    const res = await httpClient.get<ProctorEvent[] | ApiResponse<ProctorEvent[]>>(`/certification/users/${userId}/proctor-events`);
    return (res as ApiResponse<ProctorEvent[]>).data ?? (res as ProctorEvent[]);
  },
  async getProctorEventsForSession(sessionId: number): Promise<ProctorEvent[]> {
    const res = await httpClient.get<ProctorEvent[] | ApiResponse<ProctorEvent[]>>(`/certification/sessions/${sessionId}/proctor-events`);
    return (res as ApiResponse<ProctorEvent[]>).data ?? (res as ProctorEvent[]);
  },
  async getAllCertificates(): Promise<Certificate[]> {
    const res = await httpClient.get<Certificate[] | ApiResponse<Certificate[]>>('/certification/certificates/all');
    return (res as ApiResponse<Certificate[]>).data ?? (res as Certificate[]);
  },
};
