
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Target, Clock } from 'lucide-react';

export function ChallengeStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Active Challenges</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">2</p>
            </div>
            <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Participants</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">368</p>
            </div>
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">78%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Avg Duration</p>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">14 days</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
