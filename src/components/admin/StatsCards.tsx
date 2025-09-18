
import React, { useEffect, useState } from 'react';
import { Book, User, List, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { languageService } from '@/services/languageService';
import { courseService } from '@/services/courseService';
import { quizService } from '@/services/quizService';
import { searchService } from '@/services/searchService';
import { userService } from '@/services/userService';

const initialStats = [
  {
    title: "Total Languages",
    value: "-",
    description: "Active languages",
    icon: Book,
    color: "bg-amber-100 text-amber-800"
  },
  {
    title: "Courses",
    value: "-",
    description: "Published courses",
    icon: Book,
    color: "bg-green-100 text-green-800"
  },
  {
    title: "Total Users",
    value: "-",
    description: "All users registered",
    icon: User,
    color: "bg-blue-100 text-blue-800"
  },
  {
    title: "Total Quizzes",
    value: "-",
    description: "All quizzes created",
    icon: List,
    color: "bg-purple-100 text-purple-800"
  }
];


export function StatsCards() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Languages
        const languages = await languageService.getAll();
        // Courses
        const courses = await courseService.getAll();
        // Quizzes
        const quizzes = await quizService.getAll();
        // Learners
        const users = await userService.getAll();
        const usersCount = Array.isArray(users) ? users.length.toString() : '0';

        setStats([
          {
            ...initialStats[0],
            value: Array.isArray(languages) ? languages.length.toString() : 'Error',
          },
          {
            ...initialStats[1],
            value: Array.isArray(courses) ? courses.length.toString() : 'Error',
          },
          {
            ...initialStats[2],
            value: usersCount,
          },
          {
            ...initialStats[3],
            value: Array.isArray(quizzes) ? quizzes.length.toString() : 'Error',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats([
          { ...initialStats[0], value: 'Error' },
          { ...initialStats[1], value: 'Error' },
          { ...initialStats[2], value: 'Error' },
          { ...initialStats[3], value: 'Error' },
        ]);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stat.value}</div>
            <p className="text-xs text-amber-600">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
