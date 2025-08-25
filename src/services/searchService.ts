
import { httpClient } from '@/utils/httpClient';

export interface SearchFilters {
  query?: string;
  status?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SearchResult<T> {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  content: T[];
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export const searchService = {
  async searchCourses(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/courses/search?${queryParams}`);
  },

  async searchLessons(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/lessons/search?${queryParams}`);
  },

  async searchQuizzes(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/quizzes/search?${queryParams}`);
  },

  async searchChallenges(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/challenges/search?${queryParams}`);
  },

  async searchUsers(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/users/search?${queryParams}`);
  },

  async searchLanguages(filters: SearchFilters): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
    
    if (filters.sort) {
      filters.sort.forEach(sortParam => {
        queryParams.append('sort', sortParam);
      });
    }

    return await httpClient.get<SearchResult<any>>(`/languages/search?${queryParams}`);
  },
};
