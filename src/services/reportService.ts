import { httpClient } from '@/utils/httpClient';
import { userService, type BackendUserDto } from '@/services/userService';
import { courseService, type Course } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { lessonService, type Lesson } from '@/services/lessonService';
import { certificationService } from '@/services/certificationService';

export type ReportType = 
  | 'user-registration'
  | 'active-users'
  | 'course-enrollment'
  | 'course-completion'
  | 'certification-performance'
  | 'system-activity';

export type DateRange = 'today' | 'week' | 'month' | 'custom';

export interface ReportFilters {
  dateRange: DateRange;
  startDate?: string;
  endDate?: string;
  courseId?: number;
  userId?: number;
}

export interface ReportData {
  headers: string[];
  rows: (string | number)[][];
  metadata?: Record<string, any>;
}

export const reportService = {
  async generateReport(
    reportType: ReportType,
    filters: ReportFilters
  ): Promise<ReportData> {
    switch (reportType) {
      case 'user-registration':
        return this.generateUserRegistrationReport(filters);
      case 'active-users':
        return this.generateActiveUsersReport(filters);
      case 'course-enrollment':
        return this.generateCourseEnrollmentReport(filters);
      case 'course-completion':
        return this.generateCourseCompletionReport(filters);
      case 'certification-performance':
        return this.generateCertificationPerformanceReport(filters);
      case 'system-activity':
        return this.generateSystemActivityReport(filters);
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  },

  async generateUserRegistrationReport(filters: ReportFilters): Promise<ReportData> {
    const users = await userService.getAll();
    if (!Array.isArray(users) || users.length === 0) {
      return {
        headers: ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Enabled'],
        rows: [],
        metadata: { totalUsers: 0, enabledUsers: 0, disabledUsers: 0 },
      };
    }
    
    // Only filter if date field exists
    const filteredUsers = this.filterByDateRange(users, filters, 'createdAt');
    
    return {
      headers: ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Enabled'],
      rows: filteredUsers.map((user: BackendUserDto) => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.enabled ? 'Yes' : 'No',
      ]),
      metadata: {
        totalUsers: filteredUsers.length,
        enabledUsers: filteredUsers.filter((u: BackendUserDto) => u.enabled).length,
        disabledUsers: filteredUsers.filter((u: BackendUserDto) => !u.enabled).length,
      },
    };
  },

  async generateActiveUsersReport(filters: ReportFilters): Promise<ReportData> {
    // Get all users, not just enabled ones
    const users = await userService.getAll();
    if (!Array.isArray(users) || users.length === 0) {
      return {
        headers: ['ID', 'First Name', 'Last Name', 'Email', 'Enabled'],
        rows: [],
        metadata: { totalUsers: 0 },
      };
    }
    
    // Filter only if lastLogin field exists
    const filteredUsers = this.filterByDateRange(users, filters, 'lastLogin');
    
    return {
      headers: ['ID', 'First Name', 'Last Name', 'Email', 'Enabled'],
      rows: filteredUsers.map((user: BackendUserDto) => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.enabled ? 'Yes' : 'No',
      ]),
      metadata: {
        totalUsers: filteredUsers.length,
      },
    };
  },

  async generateCourseEnrollmentReport(filters: ReportFilters): Promise<ReportData> {
    const courses = await courseService.getAll();
    if (!Array.isArray(courses) || courses.length === 0) {
      return {
        headers: ['Course ID', 'Title', 'Language', 'Active'],
        rows: [],
        metadata: { totalCourses: 0, activeCourses: 0 },
      };
    }
    
    let filteredCourses = filters.courseId
      ? courses.filter((c: Course) => c.id === filters.courseId)
      : courses;
    
    // Filter by date if createdAt exists
    filteredCourses = this.filterByDateRange(filteredCourses, filters, 'createdAt');
    
    return {
      headers: ['Course ID', 'Title', 'Language', 'Active'],
      rows: filteredCourses.map((course: Course) => [
        course.id,
        course.title,
        course.language?.name || 'N/A',
        course.active ? 'Yes' : 'No',
      ]),
      metadata: {
        totalCourses: filteredCourses.length,
        activeCourses: filteredCourses.filter((c: Course) => c.active).length,
      },
    };
  },

  async generateCourseCompletionReport(filters: ReportFilters): Promise<ReportData> {
    const courses = await courseService.getAll();
    if (!Array.isArray(courses) || courses.length === 0) {
      return {
        headers: ['Course ID', 'Title', 'Status'],
        rows: [],
        metadata: { totalCourses: 0 },
      };
    }
    
    // Filter by date if createdAt exists
    const filteredCourses = this.filterByDateRange(courses, filters, 'createdAt');
    
    return {
      headers: ['Course ID', 'Title', 'Status'],
      rows: filteredCourses.map((course: Course) => [
        course.id,
        course.title,
        course.active ? 'Active' : 'Inactive',
      ]),
      metadata: {
        totalCourses: filteredCourses.length,
      },
    };
  },

  async generateCertificationPerformanceReport(filters: ReportFilters): Promise<ReportData> {
    try {
      const certificates = await certificationService.getAllCertificates();
      const filteredCerts = this.filterByDateRange(certificates, filters, 'issuedAt');
      
      return {
        headers: ['Certificate ID', 'User Email', 'Course', 'Issued Date'],
        rows: filteredCerts.map((cert: any) => [
          cert.certificateId || cert.id || 'N/A',
          cert.userEmail || 'N/A',
          cert.courseName || 'N/A',
          cert.issuedAt || 'N/A',
        ]),
        metadata: {
          totalCertificates: filteredCerts.length,
        },
      };
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      return {
        headers: ['Certificate ID', 'User Email', 'Course', 'Issued Date'],
        rows: [],
        metadata: { totalCertificates: 0 },
      };
    }
  },

  async generateSystemActivityReport(filters: ReportFilters): Promise<ReportData> {
    const [courses, quizzes, users] = await Promise.all([
      courseService.getAll().catch(() => []),
      quizService.getAll().catch(() => []),
      userService.getAll().catch(() => []),
    ]);
    
    return {
      headers: ['Type', 'Count', 'Status', 'Last Updated'],
      rows: [
        ['Courses', Array.isArray(courses) ? courses.length : 0, 'Active', new Date().toISOString()],
        ['Quizzes', Array.isArray(quizzes) ? quizzes.length : 0, 'Active', new Date().toISOString()],
        ['Users', Array.isArray(users) ? users.length : 0, 'Active', new Date().toISOString()],
      ],
      metadata: {
        totalCourses: Array.isArray(courses) ? courses.length : 0,
        totalQuizzes: Array.isArray(quizzes) ? quizzes.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
      },
    };
  },

  filterByDateRange<T extends Record<string, any>>(
    items: T[],
    filters: ReportFilters,
    dateField: string
  ): T[] {
    // If no date filtering needed or date field doesn't exist, return all items
    if (!items || items.length === 0) {
      return items;
    }
    
    // Check if date field exists in items
    const hasDateField = items.some(item => item[dateField] != null);
    if (!hasDateField) {
      // If date field doesn't exist, return all items (no filtering possible)
      return items;
    }
    
    if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // Include full end date
      return items.filter((item) => {
        const itemDate = item[dateField] ? new Date(item[dateField]) : null;
        if (!itemDate || isNaN(itemDate.getTime())) return false;
        return itemDate >= start && itemDate <= end;
      });
    }
    
    const now = new Date();
    let start: Date;
    
    switch (filters.dateRange) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return items;
    }
    
    return items.filter((item) => {
      const itemDate = item[dateField] ? new Date(item[dateField]) : null;
      if (!itemDate || isNaN(itemDate.getTime())) return false;
      return itemDate >= start;
    });
  },

  exportToCSV(data: ReportData, filename: string): void {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
