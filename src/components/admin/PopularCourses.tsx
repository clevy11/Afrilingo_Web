
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 1,
    name: "Swahili Basics",
    language: "Swahili",
    students: 1248,
    rating: 4.8,
    growth: "+23%",
    flag: "🇹🇿",
    progress: 85,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 2,
    name: "Yoruba Fundamentals",
    language: "Yoruba",
    students: 892,
    rating: 4.7,
    growth: "+18%",
    flag: "🇳🇬",
    progress: 72,
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 3,
    name: "Amharic Expressions",
    language: "Amharic",
    students: 634,
    rating: 4.9,
    growth: "+31%",
    flag: "🇪🇹",
    progress: 68,
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 4,
    name: "Zulu Conversations",
    language: "Zulu",
    students: 567,
    rating: 4.6,
    growth: "+15%",
    flag: "🇿🇦",
    progress: 91,
    color: "from-orange-500 to-red-600"
  }
];

export function PopularCourses() {
  return (
    <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)] shadow-lg bg-gradient-to-br from-white to-amber-50/30 dark:from-card dark:to-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-3 text-xl">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            Popular Courses
          </CardTitle>
          <Link to="/admin/courses">
            <Button variant="outline" size="sm" className="border-amber-300 dark:border-white/10 text-amber-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-white/10">
              View All
            </Button>
          </Link>
        </div>
        <p className="text-amber-600 dark:text-gray-400 text-sm">Top performing language courses</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <Link key={course.id} to={`/admin/courses/${course.id}`}>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-md group bg-white/80 dark:bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{course.flag}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.language}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.rating}</span>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">{course.growth}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.progress}% complete</div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
