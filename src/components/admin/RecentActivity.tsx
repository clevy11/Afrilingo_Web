
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  {
    action: "Course 'Swahili Basics' updated",
    time: "2 hours ago",
    type: "course"
  },
  {
    action: "New quiz added to Luganda Level 1",
    time: "4 hours ago",
    type: "quiz"
  },
  {
    action: "Bonus challenge 'Weekly Kinyarwanda' created",
    time: "1 day ago",
    type: "challenge"
  },
  {
    action: "15 new users registered",
    time: "2 days ago",
    type: "user"
  },
  {
    action: "Somali course published",
    time: "3 days ago",
    type: "course"
  }
];

export function RecentActivity() {
  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-amber-900">{activity.action}</p>
                <p className="text-xs text-amber-600">{activity.time}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'course' ? 'bg-amber-500' :
                activity.type === 'quiz' ? 'bg-green-500' :
                activity.type === 'challenge' ? 'bg-purple-500' :
                'bg-blue-500'
              }`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
