
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

function normalizeLesson(raw: unknown): Lesson {
  const obj = (raw as Record<string, unknown>) || {};
  const contentsRaw = obj['contents'];
  const requiredRaw = obj['required'];
  const isRequiredRaw = obj['isRequired'];

  return {
    id: Number(obj['id'] ?? 0),
    title: String(obj['title'] ?? ''),
    description: String(obj['description'] ?? ''),
    type: (obj['type'] as Lesson['type']) ?? 'READING',
    orderIndex: Number(obj['orderIndex'] ?? 0),
    course: obj['course'] as Course,
    contents: Array.isArray(contentsRaw) ? (contentsRaw as LessonContent[]) : [],
    required: Boolean(requiredRaw ?? isRequiredRaw ?? false),
  };
}

export const lessonService = {
  async getAll(): Promise<Lesson[]> {
    const response = await httpClient.get<unknown>('/lessons');
    const data = (response as { data?: unknown }).data ?? response;
    return Array.isArray(data) ? data.map((l) => normalizeLesson(l)) : [];
  },

  async getById(id: number): Promise<Lesson> {
    const response = await httpClient.get<unknown>(`/lessons/${id}`);
    const data = (response as { data?: unknown }).data ?? response;
    return normalizeLesson(data);
  },

  async getByCourseId(courseId: number): Promise<Lesson[]> {
    const response = await httpClient.get<unknown>(`/lessons/course/${courseId}`);
    const data = (response as { data?: unknown }).data ?? response;
    return Array.isArray(data) ? data.map((l) => normalizeLesson(l)) : [];
  },

  async getOrderedByCourseId(courseId: number): Promise<Lesson[]> {
    const response = await httpClient.get<unknown>(`/lessons/course/${courseId}/ordered`);
    const data = (response as { data?: unknown }).data ?? response;
    return Array.isArray(data) ? data.map((l) => normalizeLesson(l)) : [];
  },

  async getByType(lessonType: 'AUDIO' | 'READING' | 'IMAGE_OBJECT'): Promise<Lesson[]> {
    const response = await httpClient.get<unknown>(`/lessons/type/${lessonType}`);
    const data = (response as { data?: unknown }).data ?? response;
    return Array.isArray(data) ? data.map((l) => normalizeLesson(l)) : [];
  },

  async create(data: CreateLessonRequest): Promise<Lesson> {
    const response = await httpClient.post<unknown>('/lessons', data);
    const resData = (response as { data?: unknown }).data ?? response;
    return normalizeLesson(resData);
  },

  async update(id: number, data: Partial<CreateLessonRequest>): Promise<Lesson> {
    const response = await httpClient.put<unknown>(`/lessons/${id}`, data);
    const resData = (response as { data?: unknown }).data ?? response;
    return normalizeLesson(resData);
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/lessons/${id}`);
  },

  async reorderLessons(courseId: number, lessonIds: number[]): Promise<Lesson[]> {
    const response = await httpClient.post<any>(`/lessons/course/${courseId}/reorder`, lessonIds);
    return response.data || response;
  },
};
