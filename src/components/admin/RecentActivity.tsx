import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, List, Trophy, Users, Loader2, Clock } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { userService } from '@/services/userService';
import { challengeService } from '@/services/challengeService';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  action: string;
  time: string;
  timestamp: Date;
  type: 'course' | 'quiz' | 'challenge' | 'user';
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const [courses, quizzes, users, challenges] = await Promise.all([
          courseService.getAll().catch(() => []),
          quizService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          challengeService.getAll().catch(() => []),
        ]);

        const activityList: Activity[] = [];

        // Get recent courses (last 5, sorted by ID descending as proxy for recent)
        const recentCourses = Array.isArray(courses) 
          ? courses.slice(-5).reverse() 
          : [];
        recentCourses.forEach((course: any) => {
          activityList.push({
            action: `Course '${course.title}' ${course.active ? 'published' : 'updated'}`,
            time: formatDistanceToNow(new Date(course.createdAt || Date.now()), { addSuffix: true }),
            timestamp: new Date(course.createdAt || Date.now()),
            type: 'course',
          });
        });

        // Get recent quizzes
        const recentQuizzes = Array.isArray(quizzes) 
          ? quizzes.slice(-3).reverse() 
          : [];
        recentQuizzes.forEach((quiz: any) => {
          const lessonTitle = quiz.lesson?.title || 'a lesson';
          activityList.push({
            action: `New quiz added to ${lessonTitle}`,
            time: formatDistanceToNow(new Date(quiz.createdAt || Date.now()), { addSuffix: true }),
            timestamp: new Date(quiz.createdAt || Date.now()),
            type: 'quiz',
          });
        });

        // Get recent challenges
        const recentChallenges = Array.isArray(challenges) 
          ? challenges.slice(-2).reverse() 
          : [];
        recentChallenges.forEach((challenge: any) => {
          activityList.push({
            action: `Bonus challenge '${challenge.title || 'Weekly Challenge'}' created`,
            time: formatDistanceToNow(new Date(challenge.createdAt || Date.now()), { addSuffix: true }),
            timestamp: new Date(challenge.createdAt || Date.now()),
            type: 'challenge',
          });
        });

        // Get recent user registrations (grouped)
        if (Array.isArray(users) && users.length > 0) {
          const recentUsers = users.filter((u: any) => {
            const createdAt = u.createdAt || u.registrationDate;
            if (!createdAt) return false;
            const daysSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSince <= 7; // Last 7 days
          });
          
          if (recentUsers.length > 0) {
            activityList.push({
              action: `${recentUsers.length} new user${recentUsers.length > 1 ? 's' : ''} registered`,
              time: formatDistanceToNow(new Date(recentUsers[0].createdAt || Date.now()), { addSuffix: true }),
              timestamp: new Date(recentUsers[0].createdAt || Date.now()),
              type: 'user',
            });
          }
        }

        // Sort by timestamp (most recent first) and take top 5
        activityList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(activityList.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'course':
        return Book;
      case 'quiz':
        return List;
      case 'challenge':
        return Trophy;
      case 'user':
        return Users;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'course':
        return 'bg-amber-500';
      case 'quiz':
        return 'bg-green-500';
      case 'challenge':
        return 'bg-purple-500';
      case 'user':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-amber-600 dark:text-amber-400 text-sm">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 py-3 border-b border-amber-100 dark:border-white/10 last:border-b-0 group hover:bg-amber-50/50 dark:hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}/10 flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${getActivityColor(activity.type).replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900 dark:text-gray-200 leading-tight mb-1">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs text-amber-600 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} flex-shrink-0 mt-2`} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
