
import React from 'react';
import { Book, List, Trophy, Settings, Users, BarChart3, BookOpen, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const actions = [
  {
    title: "Create New Course",
    description: "Add a new language course",
    icon: Book,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
    borderColor: "border-amber-200 dark:border-amber-800/30",
    textColor: "text-amber-800 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    route: "/admin/courses/new"
  },
  {
    title: "Create Lesson",
    description: "Add new lesson content",
    icon: BookOpen,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800/30",
    textColor: "text-emerald-800 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    route: "/admin/lessons/new"
  },
  {
    title: "Create Quiz",
    description: "Add quiz questions",
    icon: List,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    borderColor: "border-blue-200 dark:border-blue-800/30",
    textColor: "text-blue-800 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    route: "/admin/quizzes/new"
  },
  {
    title: "Create Challenge",
    description: "Design bonus challenge",
    icon: Trophy,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    borderColor: "border-purple-200 dark:border-purple-800/30",
    textColor: "text-purple-800 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    route: "/admin/challenges/new"
  },
  {
    title: "Manage Users",
    description: "User administration",
    icon: Users,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20",
    borderColor: "border-rose-200 dark:border-rose-800/30",
    textColor: "text-rose-800 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    route: "/admin/users"
  },
  {
    title: "View Analytics",
    description: "Platform insights",
    icon: BarChart3,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20",
    borderColor: "border-teal-200 dark:border-teal-800/30",
    textColor: "text-teal-800 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    route: "/admin/analytics"
  }
];

export function QuickActions() {
  return (
    <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)] shadow-lg bg-gradient-to-br from-white to-amber-50/30 dark:from-card dark:to-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-3 text-xl">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Plus className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          </div>
          Quick Actions
        </CardTitle>
        <p className="text-amber-600 dark:text-gray-400 text-sm">Create and manage your content</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.title} to={action.route}>
              <Button
                variant="outline"
                className={`
                  h-auto p-0 overflow-hidden border-2 transition-all duration-300 
                  hover:scale-105 hover:shadow-lg group
                  ${action.borderColor} ${action.bgColor}
                `}
              >
                <div className="w-full p-5 flex flex-col items-center gap-3">
                  <div className={`
                    p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                    ${action.iconBg}
                  `}>
                    <action.icon className={`h-6 w-6 ${action.textColor}`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold text-sm mb-1 ${action.textColor}`}>
                      {action.title}
                    </div>
                    <div className="text-xs opacity-70 text-gray-600 dark:text-gray-400">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
