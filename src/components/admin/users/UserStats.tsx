
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  backendRole?: string;
  country?: string;
  [key: string]: any;
}

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const uniqueCountries = new Set(
    users
      .map(u => u.country)
      .filter((c): c is string => !!c && c !== 'N/A')
  ).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">{users.length}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400/70 mt-1">Kinyarwanda community</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-300">
            {users.filter(u => u.status === 'Active').length}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400/70 mt-1">Currently learning</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Proctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
            {users.filter(u => u.role === 'Instructor' || u.backendRole === 'ROLE_PROCTOR').length}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400/70 mt-1">Teaching Kinyarwanda</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">
            {uniqueCountries}
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400/70 mt-1">Represented regions</p>
        </CardContent>
      </Card>
    </div>
  );
}
