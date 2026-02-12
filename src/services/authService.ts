import { jwtDecode } from 'jwt-decode';

// Interfaces
interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_PROCTOR';
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

interface RefreshResponse {
  access_token: string;
}

interface JwtPayload {
  sub: string;
  role: string; //  'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_PROCTOR'
}

// Get API base URL from environment variables
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL_PROD || 'https://api.afrilingo.com/api/v1';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export const authService = {
  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Registration failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Authentication failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const authData: AuthResponse = await response.json();

    if (authData.user.role !== 'ROLE_ADMIN' && authData.user.role !== 'ROLE_PROCTOR') {
      throw new Error('Access denied: only admins and proctors are allowed to log in.');
    }

    // Save tokens and user info (including firstname and lastname)
    localStorage.setItem('access_token', authData.access_token);
    localStorage.setItem('refresh_token', authData.refresh_token);
    // Only store fields that exist on the user object
    const userToStore = {
      firstname: authData.user.firstname || '',
      lastname: authData.user.lastname || '',
      email: authData.user.email || '',
      role: authData.user.role || '',
    };
    localStorage.setItem('user', JSON.stringify(userToStore));

    return authData;
  },

  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      // Clear tokens if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  getStoredUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    let user: AuthResponse['user'] | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }
    // Fallback to JWT for missing fields
    if (!user || !user.firstname || !user.lastname) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const payload = jwtDecode(token) as JwtPayload & { firstname?: string; lastname?: string; email?: string };
          user = {
            ...user,
            firstname: payload.firstname || user?.firstname || '',
            lastname: payload.lastname || user?.lastname || '',
            email: payload.email || user?.email || '',
            role: payload.role || user?.role || '',
          };
        } catch (error) {
          console.error('Failed to decode JWT:', error);
        }
      }
    }
    return user;
  },
};
