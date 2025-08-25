
import { httpClient } from '@/utils/httpClient';
import { Course } from './courseService';

export interface LessonContent {
  id: number;
  contentType: 'TEXT' | 'AUDIO' | 'IMAGE_OBJECT';
  contentData: string;
  mediaUrl: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  type: 'AUDIO' | 'READING' | 'IMAGE_OBJECT';
  orderIndex: number;
  course: Course;
  contents: LessonContent[];
  required: boolean;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  type: 'AUDIO' | 'READING' | 'IMAGE_OBJECT';
  orderIndex: number;
  course: {
    id: number;
  };
  contents: {
    contentType: 'TEXT' | 'AUDIO' | 'IMAGE_OBJECT';
    contentData: string;
    mediaUrl?: string;
  }[];
  required: boolean;
}

export const lessonService = {
  async getAll(): Promise<Lesson[]> {
    const response = await httpClient.get<any>('/lessons');
    return response.data || response;
  },

  async getById(id: number): Promise<Lesson> {
    const response = await httpClient.get<any>(`/lessons/${id}`);
    return response.data || response;
  },

  async getByCourseId(courseId: number): Promise<Lesson[]> {
    const response = await httpClient.get<any>(`/lessons/course/${courseId}`);
    return response.data || response;
  },

  async getOrderedByCourseId(courseId: number): Promise<Lesson[]> {
    const response = await httpClient.get<any>(`/lessons/course/${courseId}/ordered`);
    return response.data || response;
  },

  async getByType(lessonType: 'AUDIO' | 'READING' | 'IMAGE_OBJECT'): Promise<Lesson[]> {
    const response = await httpClient.get<any>(`/lessons/type/${lessonType}`);
    return response.data || response;
  },

  async create(data: CreateLessonRequest): Promise<Lesson> {
    const response = await httpClient.post<any>('/lessons', data);
    return response.data || response;
  },

  async update(id: number, data: Partial<CreateLessonRequest>): Promise<Lesson> {
    const response = await httpClient.put<any>(`/lessons/${id}`, data);
    return response.data || response;
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/lessons/${id}`);
  },

  async reorderLessons(courseId: number, lessonIds: number[]): Promise<Lesson[]> {
    const response = await httpClient.post<any>(`/lessons/course/${courseId}/reorder`, lessonIds);
    return response.data || response;
  },
};
