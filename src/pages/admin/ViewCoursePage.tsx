
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { lessonService } from '@/services/lessonService';
import { BookOpen, Globe, BarChart3, Users } from 'lucide-react';

export default function ViewCoursePage() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || '0');

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getById(courseId),
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: () => lessonService.getByCourseId(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <FormLayout
        title="View Course"
        description="Course details and content"
        backUrl="/admin/courses"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading course...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error) {
    return (
      <FormLayout
        title="View Course"
        description="Course details and content"
        backUrl="/admin/courses"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load course. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  if (!course) {
    return (
      <FormLayout
        title="View Course"
        description="Course details and content"
        backUrl="/admin/courses"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load course. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <FormLayout
      title={course.title}
      description="Course Preview"
      backUrl="/admin/courses"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📚</span>
                <div>
                  <CardTitle className="text-2xl text-amber-900">{course.title}</CardTitle>
                  <p className="text-amber-600">{course.language.name} Language Course</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                <Badge className={course.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {course.active ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">{course.description}</p>
          </CardContent>
        </Card>

        {/* Course Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Lessons</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{lessons.length}</p>
              <p className="text-sm text-amber-600">Total lessons</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-amber-900">{course.language.name}</p>
              <p className="text-sm text-amber-600">{course.language.code.toUpperCase()}</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className={getLevelColor(course.level)} variant="outline">
                {course.level}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Course Image */}
        {course.image && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle>Course Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full max-w-md h-48 object-cover rounded-lg border border-amber-200"
              />
            </CardContent>
          </Card>
        )}

        {/* Lessons Overview */}
        {lessons.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Course Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessons
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 border border-amber-200 rounded-lg">
                      <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {lesson.orderIndex}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">{lesson.title}</p>
                        <p className="text-sm text-amber-600">{lesson.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                        <span className="text-xs text-amber-600">{lesson.contents.length} content(s)</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Language Information */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle>Language Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-medium text-amber-800">{course.language.name}</p>
                <p className="text-sm text-amber-600">Language Code: {course.language.code}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}
