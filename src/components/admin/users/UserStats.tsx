
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  coursesEnrolled: number;
  completionRate: number;
  avatar: string;
}

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{users.length}</div>
          <p className="text-xs text-blue-600 mt-1">Kinyarwanda community</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {users.filter(u => u.status === 'Active').length}
          </div>
          <p className="text-xs text-green-600 mt-1">Currently learning</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {users.filter(u => u.role === 'Instructor').length}
          </div>
          <p className="text-xs text-purple-600 mt-1">Teaching Kinyarwanda</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">Avg. Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">
            {Math.round(users.reduce((acc, u) => acc + u.completionRate, 0) / users.length)}%
          </div>
          <p className="text-xs text-orange-600 mt-1">Course progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
