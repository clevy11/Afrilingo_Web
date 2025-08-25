
import { authService } from '@/services/authService';

class HttpClient {
  private baseURL: string;
  // Simple in-memory cache for GETs
  private cache: Map<string, { expiry: number; data: unknown }>; 
  private inFlight: Map<string, Promise<unknown>>;
  private defaultTTL: number;

  constructor() {
    this.baseURL = import.meta.env.PROD 
      ? import.meta.env.VITE_API_BASE_URL_PROD || 'https://api.afrilingo.com/api/v1'
      : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
    this.cache = new Map();
    this.inFlight = new Map();
    this.defaultTTL = Number(import.meta.env.VITE_HTTP_CACHE_TTL_MS || 300000); // 5m default
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = authService.getAccessToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // If token expired, try to refresh
      if (response.status === 401 && accessToken) {
        try {
          const refreshResponse = await authService.refreshToken();
          localStorage.setItem('access_token', refreshResponse.access_token);

          // Retry original request with new token
          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${refreshResponse.access_token}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          return retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, redirect to login
          authService.logout();
          window.location.href = '/';
          throw new Error('Session expired');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }

  private buildCacheKey(endpoint: string): string {
    const token = authService.getAccessToken() || '';
    return `${this.baseURL}::${endpoint}::${token}`;
  }

  async get<T>(endpoint: string, options?: { cacheTTLMs?: number; bypassCache?: boolean; cacheKey?: string }): Promise<T> {
    const ttl = options?.cacheTTLMs ?? this.defaultTTL;
    const key = options?.cacheKey || this.buildCacheKey(endpoint);

    if (!options?.bypassCache) {
      const cached = this.cache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.data as T;
      }

      const flight = this.inFlight.get(key);
      if (flight) {
        return flight as Promise<T>;
      }
    }

    const reqPromise = this.request<T>(endpoint, { method: 'GET' })
      .then((data) => {
        if (!options?.bypassCache && ttl > 0) {
          this.cache.set(key, { data, expiry: Date.now() + ttl });
        }
        this.inFlight.delete(key);
        return data;
      })
      .catch((err) => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, reqPromise as Promise<unknown>);
    return reqPromise;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    // Invalidate cache after writes
    this.cache.clear();
    return res;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    this.cache.clear();
    return res;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    this.cache.clear();
    return res;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await this.request<T>(endpoint, { method: 'DELETE' });
    this.cache.clear();
    return res;
  }
}

export const httpClient = new HttpClient();
