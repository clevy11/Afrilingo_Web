import { httpClient } from '@/utils/httpClient';

export interface QuestionOption {
  id: number;
  optionText: string;
  optionMedia?: string;
  correct: boolean;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  mediaUrl?: string;
  points: number;
  options?: QuestionOption[];
}

export interface CreateQuestionRequest {
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  mediaUrl?: string;
  points: number;
  options?: Omit<QuestionOption, 'id'>[];
}

export interface CreateQuestionOptionRequest {
  optionText: string;
  optionMedia?: string;
  correct: boolean;
}

export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export const questionService = {
  async getAll(): Promise<Question[]> {
    const response = await httpClient.get<{ data: Question[] }>('/questions');
    return response.data;
  },

  async getById(id: number): Promise<Question> {
    const response = await httpClient.get<{ data: Question }>(`/questions/${id}`);
    return response.data;
  },

  async getByQuizId(quizId: number): Promise<Question[]> {
    return await httpClient.get<Question[]>(`/questions/quiz/${quizId}`);
  },

  async getByQuizIdAndType(quizId: number, questionType: string): Promise<Question[]> {
    return await httpClient.get<Question[]>(`/questions/quiz/${quizId}/type/${questionType}`);
  },

  async getPaginated(page: number = 0, size: number = 20, sort?: string[]): Promise<PaginatedResponse<Question>> {
    const params = new URLSearchParams({
      'pageable.page': page.toString(),
      'pageable.size': size.toString(),
    });
    
    if (sort) {
      sort.forEach(s => params.append('pageable.sort', s));
    }
    
    return await httpClient.get<PaginatedResponse<Question>>(`/questions/paginated?${params}`);
  },

  async search(keyword: string): Promise<Question[]> {
    return await httpClient.get<Question[]>(`/questions/search?keyword=${encodeURIComponent(keyword)}`);
  },

  async getOptions(id: number): Promise<QuestionOption[]> {
    return await httpClient.get<QuestionOption[]>(`/questions/${id}/options`);
  },

  async create(data: CreateQuestionRequest): Promise<Question> {
    const response = await httpClient.post<{ data: Question }>('/questions', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateQuestionRequest>): Promise<Question> {
    return await httpClient.put<Question>(`/questions/${id}`, { id, ...data });
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`/questions/${id}`);
  },

  async addOption(id: number, optionData: CreateQuestionOptionRequest): Promise<Question> {
    return await httpClient.post<Question>(`/questions/${id}/options`, optionData);
  },

  async deleteOption(questionId: number, optionId: number): Promise<Question> {
    return await httpClient.delete<Question>(`/questions/${questionId}/options/${optionId}`);
  },
};
