
import { httpClient } from '@/utils/httpClient';
import { Course } from './courseService';

export interface LessonContent {
  id: number;
  contentType: 'TEXT' | 'AUDIO' | 'IMAGE_OBJECT';
  contentData: string;
  mediaUrl: string;
}
export interface LessonContentResponse {
  id: number;
  title: string;
  description: string;
  type: 'TEXT' | 'AUDIO' | 'IMAGE_OBJECT';
  contentData: string;
  mediaUrl: string;
}

export interface Page<T> {
  content: T[];
  pageable?: unknown;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort?: unknown;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
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

function normalizeLessonContent(raw: unknown): LessonContent {
  const obj = (raw as Record<string, unknown>) || {};
  return {
    id: Number(obj['id'] ?? 0),
    contentType: (obj['contentType'] as LessonContent['contentType']) ?? 'TEXT',
    contentData: String(obj['contentData'] ?? ''),
    mediaUrl: String(obj['mediaUrl'] ?? ''),
  };
}

export const lessonService = {
  async getAllPaginated(params?: { page?: number; size?: number; sort?: string[] }): Promise<Page<Lesson>> {
    const page = params?.page ?? 0;
    const size = params?.size ?? 20;
    const sortParams = params?.sort ?? [];
    const qs = new URLSearchParams();
    qs.set('page', String(page));
    qs.set('size', String(size));
    for (const s of sortParams) qs.append('sort', s);
    const response = await httpClient.get<unknown>(`/lessons/paginated?${qs.toString()}`);
    const data = (response as { data?: any }).data ?? response;
    const contentRaw = Array.isArray((data as any)?.content) ? (data as any).content : [];
    const normalized = contentRaw.map((l: unknown) => normalizeLesson(l));
    return {
      content: normalized,
      pageable: (data as any)?.pageable,
      totalPages: Number((data as any)?.totalPages ?? 1),
      totalElements: Number((data as any)?.totalElements ?? normalized.length),
      last: Boolean((data as any)?.last ?? true),
      size: Number((data as any)?.size ?? size),
      number: Number((data as any)?.number ?? page),
      sort: (data as any)?.sort,
      numberOfElements: Number((data as any)?.numberOfElements ?? normalized.length),
      first: Boolean((data as any)?.first ?? page === 0),
      empty: Boolean((data as any)?.empty ?? normalized.length === 0),
    } as Page<Lesson>;
  },
  async getAll(): Promise<Lesson[]> {
    const response = await httpClient.get<unknown>('/lessons/paginated');
    const data = (response as { data?: unknown }).data ?? response;
    // Support both paginated shape { content: [...] } and plain array [...]
    const items = Array.isArray((data as any)?.content)
      ? (data as any).content
      : Array.isArray(data)
        ? (data as any)
        : [];
    return items.map((l: unknown) => normalizeLesson(l));
  },
  async getAllContents(id: number): Promise<LessonContent[]> {
    const response = await httpClient.get<unknown>(`/lessons/${id}/contents`);
    const data = (response as { data?: unknown }).data ?? response;
    return Array.isArray(data) ? data.map((l) => normalizeLessonContent(l)) : [];
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
