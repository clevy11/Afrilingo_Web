
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserProfile } from '@/components/admin/UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { User, Trophy, BookOpen, Target, Calendar } from 'lucide-react';
import { userService, type BackendUserDto } from '@/services/userService';

const ProfilePage = () => {
  const [stats, setStats] = React.useState([
    { label: "Courses Created", value: '-', icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { label: "Total Students", value: '-', icon: User, color: "from-green-500 to-green-600" },
    { label: "Quizzes Created", value: '-', icon: Trophy, color: "from-purple-500 to-purple-600" },
    { label: "Success Rate", value: '-', icon: Target, color: "from-orange-500 to-orange-600" }
  ]);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        // Courses
        const courses = await import('@/services/courseService').then(m => m.courseService.getAll());
        // Quizzes
        const quizzes = await import('@/services/quizService').then(m => m.quizService.getAll());
        // Students (learners with ROLE_USER)
        let studentsCount = '-';
        try {
          const users: BackendUserDto[] = await userService.getAll();
          studentsCount = Array.isArray(users)
            ? users.filter((u: BackendUserDto) => u.role === 'ROLE_USER').length.toString()
            : '-';
        } catch {
          studentsCount = '-';
        }
        // Success Rate (mock or replace with real API if available)
        const successRate = '-';
        setStats([
          { label: "Courses Created", value: Array.isArray(courses) ? courses.length.toString() : '-', icon: BookOpen, color: "from-blue-500 to-blue-600" },
          { label: "Total Students", value: studentsCount, icon: User, color: "from-green-500 to-green-600" },
          { label: "Quizzes Created", value: Array.isArray(quizzes) ? quizzes.length.toString() : '-', icon: Trophy, color: "from-purple-500 to-purple-600" },
          { label: "Success Rate", value: successRate, icon: Target, color: "from-orange-500 to-orange-600" }
        ]);
      } catch {
        setStats([
          { label: "Courses Created", value: 'Error', icon: BookOpen, color: "from-blue-500 to-blue-600" },
          { label: "Total Students", value: 'Error', icon: User, color: "from-green-500 to-green-600" },
          { label: "Quizzes Created", value: 'Error', icon: Trophy, color: "from-purple-500 to-purple-600" },
          { label: "Success Rate", value: 'Error', icon: Target, color: "from-orange-500 to-orange-600" }
        ]);
      }
    }
    fetchStats();
  }, []);

  const recentActivity = [
    { action: "Created new Swahili course", date: "2 hours ago" },
    { action: "Updated Yoruba pronunciation lesson", date: "1 day ago" },
    { action: "Published weekly challenge", date: "3 days ago" },
    { action: "Responded to student feedback", date: "5 days ago" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-amber-800" />
          <h1 className="text-3xl font-bold text-amber-900">My Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-700">{stat.label}</p>
                        <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-amber-100 last:border-0">
                      <p className="text-amber-800">{activity.action}</p>
                      <Badge variant="outline" className="text-amber-600">{activity.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Learning Progress */}
            
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
