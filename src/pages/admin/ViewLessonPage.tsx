
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '@/services/lessonService';
import { BookOpen, Hash, Type, CheckCircle, Clock } from 'lucide-react';

export default function ViewLessonPage() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || '0');

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonService.getById(lessonId),
    enabled: !!lessonId,
  });

  if (isLoading) {
    return (
      <FormLayout
        title="View Lesson"
        description="Lesson details and content"
        backUrl="/admin/lessons"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading lesson...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error || !lesson) {
    return (
      <FormLayout
        title="View Lesson"
        description="Lesson details and content"
        backUrl="/admin/lessons"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load lesson. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'AUDIO': return '🎵';
      case 'READING': return '📖';
      case 'IMAGE_OBJECT': return '🖼️';
      default: return '📚';
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'AUDIO': return 'bg-purple-100 text-purple-800';
      case 'READING': return 'bg-green-100 text-green-800';
      case 'IMAGE_OBJECT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return '📝';
      case 'AUDIO': return '🎵';
      case 'IMAGE_OBJECT': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <FormLayout
      title={lesson.title}
      description="Lesson Preview"
      backUrl="/admin/lessons"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getLessonTypeIcon(lesson.type)}</span>
                <div>
                  <CardTitle className="text-2xl text-amber-900">{lesson.title}</CardTitle>
                  <p className="text-amber-600">Course: {lesson.course.title}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getLessonTypeColor(lesson.type)}>
                  {lesson.type}
                </Badge>
                {lesson.required && (
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    Required
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">{lesson.description}</p>
          </CardContent>
        </Card>

        {/* Lesson Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Order</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{lesson.orderIndex}</p>
              <p className="text-sm text-amber-600">Lesson order</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className={getLessonTypeColor(lesson.type)} variant="outline">
                {lesson.type}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant={lesson.required ? "destructive" : "secondary"}>
                {lesson.required ? "Required" : "Optional"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Contents */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              Lesson Contents ({lesson.contents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lesson.contents.map((content, index) => (
                <div key={content.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getContentTypeIcon(content.contentType)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-amber-800">Content {index + 1}</h4>
                        <Badge variant="outline" className="text-xs">
                          {content.contentType}
                        </Badge>
                      </div>
                      {content.mediaUrl && (
                        <p className="text-sm text-amber-600 mb-2">
                          Media: <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            {content.mediaUrl}
                          </a>
                        </p>
                      )}
                      <div className="prose prose-amber prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-amber-700">{content.contentData}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {lesson.contents.length === 0 && (
                <p className="text-amber-600 text-center py-4">No content available for this lesson.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Information */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle>Associated Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-medium text-amber-800">{lesson.course.title}</p>
                <p className="text-sm text-amber-600">{lesson.course.description}</p>
                <p className="text-xs text-amber-500">
                  {lesson.course.language.name} • {lesson.course.level}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}
