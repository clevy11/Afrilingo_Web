import { httpClient } from '@/utils/httpClient';
import { Lesson } from './lessonService';

export interface QuizOption {
  id: number;
  optionText: string;
  optionMedia: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  mediaUrl: string;
  points: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  minPassingScore: number;
  lesson: Lesson;
  questions: QuizQuestion[];
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  minPassingScore: number;
  lesson: {
    id: number;
  };
}

export interface UpdateQuizRequest {
  id: number;
  title: string;
  description: string;
  minPassingScore: number;
  lesson: {
    id: number;
  };
}

export interface CreateQuestionRequest {
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  mediaUrl?: string;
  points: number;
  options: Omit<QuizOption, 'id'>[];
}

export interface PaginatedQuizzesRequest {
  page: number;
  size: number;
  sort?: string[];
}

export interface PaginatedQuizzesResponse {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  content: Quiz[];
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export const quizService = {
  async getAll(): Promise<Quiz[]> {
    const response = await httpClient.get<{ data: Quiz[] }>('/quizzes');
    return response.data;
  },

  async getById(id: number): Promise<Quiz> {
    const response = await httpClient.get<{ data: Quiz }>(`/quizzes/${id}`);
    return response.data;
  },

  async getByLessonId(lessonId: number): Promise<Quiz[]> {
    const response = await httpClient.get<{ data: Quiz[] }>(`/quizzes/lesson/${lessonId}`);
    return response.data;
  },

  async getPaginated(params: PaginatedQuizzesRequest): Promise<PaginatedQuizzesResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });
    if (params.sort) {
      params.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }
    const response = await httpClient.get<{ data: PaginatedQuizzesResponse }>(`/quizzes/paginated?${queryParams}`);
    return response.data;
  },

  async create(data: CreateQuizRequest): Promise<Quiz> {
    const response = await httpClient.post<{ data: Quiz }>('/quizzes', data);
    return response.data;
  },

  async update(id: number, data: UpdateQuizRequest): Promise<Quiz> {
    const response = await httpClient.put<{ data: Quiz }>(`/quizzes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`/quizzes/${id}`);
  },

  async getQuestions(id: number): Promise<QuizQuestion[]> {
    const response = await httpClient.get<{ data: QuizQuestion[] }>(`/quizzes/${id}/questions`);
    return response.data;
  },

  async addQuestion(id: number, questionData: CreateQuestionRequest): Promise<Quiz> {
    const response = await httpClient.post<{ data: Quiz }>(`/quizzes/${id}/questions`, questionData);
    return response.data;
  },

  async removeQuestion(quizId: number, questionId: number): Promise<Quiz> {
    const response = await httpClient.delete<{ data: Quiz }>(`/quizzes/${quizId}/questions/${questionId}`);
    return response.data;
  },

  async getStatistics(id: number): Promise<Record<string, any>> {
    const response = await httpClient.get<{ data: Record<string, any> }>(`/quizzes/${id}/statistics`);
    return response.data;
  },
};