import { httpClient } from '@/utils/httpClient';

export interface BackendUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_PROCTOR' | string;
  enabled: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_PROCTOR';
  enabled?: boolean;
}

interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
}

export const userService = {
  async getAll(): Promise<BackendUserDto[]> {
    const res = await httpClient.get<BackendUserDto[] | ApiResponse<BackendUserDto[]>>('/users/all');
    return (res as ApiResponse<BackendUserDto[]>).data ?? (res as BackendUserDto[]);
  },

  async getEnabled(): Promise<BackendUserDto[]> {
    const res = await httpClient.get<BackendUserDto[] | ApiResponse<BackendUserDto[]>>('/users/enabled');
    return (res as ApiResponse<BackendUserDto[]>).data ?? (res as BackendUserDto[]);
  },

  async create(data: CreateUserRequest): Promise<BackendUserDto> {
    const res = await httpClient.post<BackendUserDto | ApiResponse<BackendUserDto>>('/users', data);
    return (res as ApiResponse<BackendUserDto>).data ?? (res as BackendUserDto);
  },

  async delete(id: number): Promise<BackendUserDto> {
    const res = await httpClient.delete<BackendUserDto | ApiResponse<BackendUserDto>>(`/users/${id}`);
    return (res as ApiResponse<BackendUserDto>).data ?? (res as BackendUserDto);
  },

  async setEnabled(id: number, value: boolean): Promise<BackendUserDto> {
    const res = await httpClient.patch<BackendUserDto | ApiResponse<BackendUserDto>>(`/users/${id}/enabled?value=${value}`);
    return (res as ApiResponse<BackendUserDto>).data ?? (res as BackendUserDto);
  },
};
