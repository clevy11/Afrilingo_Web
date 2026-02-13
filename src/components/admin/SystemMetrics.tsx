import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileQuestion, Award, Loader2, TrendingUp } from 'lucide-react';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { questionService } from '@/services/questionService';
import { certificationService } from '@/services/certificationService';

interface Metric {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        
        const [users, courses, quizzes, questions, certificates] = await Promise.all([
          userService.getAll().catch(() => []),
          courseService.getAll().catch(() => []),
          quizService.getAll().catch(() => []),
          questionService.getAll().catch(() => []),
          certificationService.getAllCertificates().catch(() => []),
        ]);

        const totalUsers = Array.isArray(users) ? users.length : 0;
        const activeUsers = Array.isArray(users) ? users.filter((u: any) => u.enabled !== false).length : 0;
        const totalCourses = Array.isArray(courses) ? courses.length : 0;
        const totalQuizzes = Array.isArray(quizzes) ? quizzes.length : 0;
        // Handle questionService response format
        const questionsArray = Array.isArray(questions) 
          ? questions 
          : (questions as any)?.data || [];
        const totalQuestions = Array.isArray(questionsArray) ? questionsArray.length : 0;
        const totalCertificates = Array.isArray(certificates) ? certificates.length : 0;

        setMetrics([
          {
            label: 'Total Users',
            value: totalUsers,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          },
          {
            label: 'Active Users',
            value: activeUsers,
            icon: TrendingUp,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
          },
          {
            label: 'Total Courses',
            value: totalCourses,
            icon: BookOpen,
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          },
          {
            label: 'Total Questions',
            value: totalQuestions,
            icon: FileQuestion,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          },
          {
            label: 'Total Certifications',
            value: totalCertificates,
            icon: Award,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        ) : metrics.length === 0 ? (
          <div className="text-center py-8 text-amber-600 dark:text-amber-400 text-sm">
            Unable to load metrics
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-amber-100 dark:border-white/10 hover:bg-amber-50/50 dark:hover:bg-white/10 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-600 dark:text-gray-400 mb-0.5">
                      {metric.label}
                    </p>
                    <p className="text-lg font-bold text-amber-900 dark:text-gray-100">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
