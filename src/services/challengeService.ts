
import { httpClient } from '@/utils/httpClient';
import { Course } from './courseService';

export interface ChallengeOption {
  id: number;
  optionText: string;
  optionMedia: string;
  correct: boolean;
}

export interface ChallengeQuestion {
  id: number;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  mediaUrl: string;
  points: number;
  options: ChallengeOption[];
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  timeLimit: string;
  requirements: string[];
  rewards: string[];
  minPassingScore: number;
  course: Course;
  questions: ChallengeQuestion[];
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  minPassingScore: number;
  course: {
    id: number;
  };
}

export interface UpdateChallengeRequest {
  id: number;
  title: string;
  description: string;
  minPassingScore: number;
  course: {
    id: number;
  };
}

export interface CreateChallengeQuestionRequest {
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  mediaUrl?: string;
  points: number;
  options: Omit<ChallengeOption, 'id'>[];
}

export interface PaginatedChallengesRequest {
  page: number;
  size: number;
  sort?: string[];
}

export interface PaginatedChallengesResponse {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  content: Challenge[];
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export const challengeService = {
  async getAll(): Promise<Challenge[]> {
    return await httpClient.get<Challenge[]>('/challenges');
  },

  async getById(id: number): Promise<Challenge> {
    return await httpClient.get<Challenge>(`/challenges/${id}`);
  },

  async getByCourseId(courseId: number): Promise<Challenge[]> {
    return await httpClient.get<Challenge[]>(`/challenges/course/${courseId}`);
  },

  async getPaginated(params: PaginatedChallengesRequest): Promise<PaginatedChallengesResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });
    
    if (params.sort) {
      params.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<PaginatedChallengesResponse>(`/challenges/paginated?${queryParams}`);
  },

  async create(data: CreateChallengeRequest): Promise<Challenge> {
    return await httpClient.post<Challenge>('/challenges', data);
  },

  async update(id: number, data: UpdateChallengeRequest): Promise<Challenge> {
    return await httpClient.put<Challenge>(`/challenges/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`/challenges/${id}`);
  },

  async getQuestions(id: number): Promise<ChallengeQuestion[]> {
    return await httpClient.get<ChallengeQuestion[]>(`/challenges/${id}/questions`);
  },

  async addQuestion(id: number, questionData: CreateChallengeQuestionRequest): Promise<Challenge> {
    return await httpClient.post<Challenge>(`/challenges/${id}/questions`, questionData);
  },

  async removeQuestion(challengeId: number, questionId: number): Promise<Challenge> {
    return await httpClient.delete<Challenge>(`/challenges/${challengeId}/questions/${questionId}`);
  },

  async getStatistics(id: number): Promise<Record<string, any>> {
    return await httpClient.get<Record<string, any>>(`/challenges/${id}/statistics`);
  },
};
