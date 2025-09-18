import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen, Trophy, Target } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { searchService } from '@/services/searchService';
import { lessonService, type Lesson } from '@/services/lessonService';
import type { Course } from '@/services/courseService';
import { userService, type BackendUserDto } from '@/services/userService';

export default function AnalyticsPage() {

  const [analyticsData, setAnalyticsData] = useState([
    {
      title: "Total Learners",
      value: "-",
      change: "",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Courses",
      value: "-",
      change: "",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Completed Challenges",
      value: "-",
      change: "",
      icon: Trophy,
      color: "text-yellow-600"
    },

  ]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Total Users (learners)
        let usersCount = '-';
        try {
          const users: BackendUserDto[] = await userService.getAll();
          usersCount = Array.isArray(users)
            ? users.filter((u: BackendUserDto) => u.role === 'ROLE_USER').length.toString()
            : '-';
        } catch {
          usersCount = '-';
        }

        // Active Courses
        let coursesCount = '-';
        try {
          const courses = await courseService.getAll();
          coursesCount = Array.isArray(courses) ? courses.length.toString() : '-';
        } catch {
          coursesCount = '-';
        }

        // Quizzes
        let quizzesCount = '-';
        try {
          const quizzes = await quizService.getAll();
          quizzesCount = Array.isArray(quizzes) ? quizzes.length.toString() : 'Unavailable';
        } catch {
          quizzesCount = 'Unavailable';
        }


        setAnalyticsData([
          {
            title: "Total Users",
            value: usersCount,
            change: "",
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Active Courses",
            value: coursesCount,
            change: "",
            icon: BookOpen,
            color: "text-green-600"
          },
          {
            title: "Quizzes",
            value: quizzesCount,
            change: "",
            icon: Trophy,
            color: "text-yellow-600"
          },
          // ...existing code...
        ]);
      } catch (error) {
        // fallback: keep dashes
      }
    }
    fetchAnalytics();
  }, []);

  // Dynamic chart data derived from existing endpoints (no backend changes)
  const [userEngagementData, setUserEngagementData] = useState<{ name: string; active: number }[]>([]);
  const [coursePerformanceData, setCoursePerformanceData] = useState<{ name: string; completion: number }[]>([]);

  useEffect(() => {
    async function buildCharts() {
      try {
        // User Engagement proxy: number of courses per language (higher activity => more courses)
        const courses: Course[] = await courseService.getAll();
        const byLanguage = new Map<string, number>();
        (Array.isArray(courses) ? courses : []).forEach((c: Course) => {
          const lang = c?.language?.name || 'Unknown';
          byLanguage.set(lang, (byLanguage.get(lang) || 0) + 1);
        });
        const engagement = Array.from(byLanguage.entries()).map(([name, cnt]) => ({ name, active: cnt }));
        setUserEngagementData(engagement);

        // Course Performance proxy: number of lessons per course (more lessons => richer course)
        const lessons: Lesson[] = await lessonService.getAll();
        const byCourse = new Map<string, number>();
        (Array.isArray(lessons) ? lessons : []).forEach((l: Lesson) => {
          const courseName = l?.course?.title || 'Unknown';
          byCourse.set(courseName, (byCourse.get(courseName) || 0) + 1);
        });
        const performance = Array.from(byCourse.entries())
          .map(([name, cnt]) => ({ name, completion: cnt }))
          .sort((a, b) => b.completion - a.completion)
          .slice(0, 6);
        setCoursePerformanceData(performance);
      } catch (e) {
        // leave charts empty on failure
        setUserEngagementData([]);
        setCoursePerformanceData([]);
      }
    }
    buildCharts();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-amber-900">Analytics Dashboard</h1>
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch">
          {analyticsData.map((item) => (
            <Card key={item.title} className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">
                  {item.title}
                </CardTitle>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userEngagementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" fill="#F59E42" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coursePerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completion" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
