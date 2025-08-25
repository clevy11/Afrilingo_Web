import { authService } from '@/services/authService';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_PROCTOR' | 'ROLE_USER';

export const roleUtils = {
  getCurrentUserRole(): UserRole | null {
    const user = authService.getStoredUser();
    return user?.role as UserRole || null;
  },

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ROLE_ADMIN';
  },

  isProctor(): boolean {
    return this.getCurrentUserRole() === 'ROLE_PROCTOR';
  },

  isUser(): boolean {
    return this.getCurrentUserRole() === 'ROLE_USER';
  },

  canAccessDashboard(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ROLE_ADMIN' || role === 'ROLE_PROCTOR';
  },

  canAccessOverview(): boolean {
    return this.isAdmin();
  },

  canAccessUserManagement(): boolean {
    return this.isAdmin();
  },

  canAccessContentManagement(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ROLE_ADMIN' || role === 'ROLE_PROCTOR';
  },

  getUserDisplayTitle(): string {
    const role = this.getCurrentUserRole();
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Kinyarwanda Admin';
      case 'ROLE_PROCTOR':
        return 'Kinyarwanda Tutor';
      default:
        return 'User';
    }
  },

  getUserDisplayRole(): string {
    const role = this.getCurrentUserRole();
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrator';
      case 'ROLE_PROCTOR':
        return 'Tutor';
      default:
        return 'User';
    }
  }
};
