
import { httpClient } from '@/utils/httpClient';
import { Language } from './languageService';

export interface Course {
  id: number;
  version: number;
  title: string;
  description: string;
  level: string;
  image: string;
  active: boolean;
  language: Language;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  level: string;
  image: string;
  active: boolean;
  language: Language;
}

export interface UpdateCourseRequest {
  id: number;
  version: number;
  title: string;
  description: string;
  level: string;
  image: string;
  active: boolean;
  language: Language;
}

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await httpClient.get<any>('/courses');
    return response.data || response;
  },

  async getById(id: number): Promise<Course> {
    const response = await httpClient.get<any>(`/courses/${id}`);
    return response.data || response;
  },

  async getByLanguageId(languageId: number): Promise<Course[]> {
    const response = await httpClient.get<any>(`/courses/language/${languageId}`);
    return response.data || response;
  },

  async getActiveByLanguageId(languageId: number): Promise<Course[]> {
    const response = await httpClient.get<any>(`/courses/language/${languageId}/active`);
    return response.data || response;
  },

  async create(data: CreateCourseRequest): Promise<Course> {
    const response = await httpClient.post<any>('/courses', data);
    return response.data || response;
  },

  async update(id: number, data: UpdateCourseRequest): Promise<Course> {
    const response = await httpClient.put<any>(`/courses/${id}`, data);
    return response.data || response;
  },

  async setActivation(id: number, active: boolean): Promise<Course> {
    const response = await httpClient.patch<any>(`/courses/${id}/activation?active=${active}`);
    return response.data || response;
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/courses/${id}`);
  },
};
