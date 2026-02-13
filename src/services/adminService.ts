import { httpClient } from '@/utils/httpClient';

export interface AdminSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bio?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    dashboardLayout: 'default' | 'compact' | 'expanded';
  };
  general: {
    language: string;
    timezone: string;
  };
}

interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
}

export const adminService = {
  async getSettings(): Promise<AdminSettings> {
    // Fetch user name from profile/name endpoint
    const nameRes = await httpClient.get<any>('/profile/name');
    const nameData = (nameRes as ApiResponse<any>).data ?? nameRes;
    
    // Fetch full profile for additional info
    const profileRes = await httpClient.get<any>('/profile').catch(() => null);
    const profileData = profileRes ? ((profileRes as ApiResponse<any>).data ?? profileRes) : {};
    
    // Get theme from localStorage (managed by ThemeProvider)
    const storedTheme = localStorage.getItem('vite-ui-theme') || 'system';
    
    // Return settings structure with real data
    return {
      profile: {
        firstName: nameData.firstName || '',
        lastName: nameData.lastName || '',
        email: nameData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || profileData.reasonToLearn || '',
      },
      notifications: {
        email: true,
        push: false,
        weekly: true,
        marketing: false,
      },
      security: {
        twoFactorEnabled: false,
      },
      appearance: {
        theme: (storedTheme as 'light' | 'dark' | 'system') || 'system',
        dashboardLayout: 'default',
      },
      general: {
        language: 'en',
        timezone: 'africa/kigali',
      },
    };
  },

  async updateProfile(data: Partial<AdminSettings['profile']>): Promise<void> {
    await httpClient.put('/profile', data);
  },

  async updateNotifications(data: Partial<AdminSettings['notifications']>): Promise<void> {
    // When backend adds notification preferences endpoint, use it here
    // For now, store in localStorage as a fallback
    localStorage.setItem('admin_notification_preferences', JSON.stringify(data));
  },

  async updateSecurity(data: Partial<AdminSettings['security']>): Promise<void> {
    // When backend adds security settings endpoint, use it here
    localStorage.setItem('admin_security_settings', JSON.stringify(data));
  },

  async updateAppearance(data: Partial<AdminSettings['appearance']>): Promise<void> {
    localStorage.setItem('admin_appearance_settings', JSON.stringify(data));
    // Theme is managed by ThemeProvider, so we update its storage key
    if (data.theme) {
      localStorage.setItem('vite-ui-theme', data.theme);
      // Trigger theme update by dispatching storage event
      window.dispatchEvent(new Event('storage'));
    }
  },

  async updateGeneral(data: Partial<AdminSettings['general']>): Promise<void> {
    localStorage.setItem('admin_general_settings', JSON.stringify(data));
  },
};
