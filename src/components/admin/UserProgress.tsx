
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const progressData = [

  {
    metric: "Daily Active Users",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    metric: "Completion Rate",
    value: "73.2%",
    change: "+5.3%",
    icon: Target,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  {
    metric: "Certificates Earned",
    value: "156",
    change: "+28",
    icon: Award,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    metric: "Avg. Session Time",
    value: "24 min",
    change: "+3 min",
    icon: Clock,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  }
];

const recentAchievements = [
  { user: "Amara K.", achievement: "Completed Swahili Level 2", time: "2 hours ago", flag: "🇹🇿" },
  { user: "Kwame D.", achievement: "50-day streak in Yoruba", time: "4 hours ago", flag: "🇳🇬" },
  { user: "Fatima S.", achievement: "Perfect score on Amharic quiz", time: "6 hours ago", flag: "🇪🇹" },
  { user: "Tendai M.", achievement: "Unlocked Zulu conversations", time: "8 hours ago", flag: "🇿🇦" }
];

export function UserProgress() {
  return (
    <Card className="border-border shadow-lg bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-3 text-xl">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Target className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            User Progress
          </CardTitle>
          <Link to="/admin/analytics">
            <Button variant="outline" size="sm" className="border-border text-amber-700 dark:text-gray-300 hover:bg-card/95">
              Detailed View
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {progressData.map((item) => (
            <div key={item.metric} className="p-3 rounded-lg bg-card/80 border border-border hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded ${item.bgColor}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
              <div className="text-xs text-muted dark:text-gray-400 mb-1">{item.metric}</div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">{item.change}</div>
            </div>
          ))}
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </h4>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/60 dark:bg-white/5 border border-border">
                <div className="text-lg">{achievement.flag}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground dark:text-gray-200">{achievement.user}</div>
                  <div className="text-xs text-muted dark:text-gray-400 truncate">{achievement.achievement}</div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{achievement.time}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
