
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { languageService } from '@/services/languageService';
import { courseService } from '@/services/courseService';
import { Globe, BookOpen, Edit } from 'lucide-react';

export default function ViewLanguagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const languageId = parseInt(id || '0');

  const { data: language, isLoading, error } = useQuery({
    queryKey: ['language', languageId],
    queryFn: () => languageService.getById(languageId),
    enabled: !!languageId,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['language-courses', languageId],
    queryFn: () => courseService.getByLanguageId(languageId),
    enabled: !!languageId,
  });

  if (isLoading) {
    return (
      <FormLayout
        title="View Language"
        description="Language details and courses"
        backUrl="/admin/languages"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading language...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error || !language) {
    return (
      <FormLayout
        title="View Language"
        description="Language details and courses"
        backUrl="/admin/languages"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load language. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title={language.name}
      description="Language Details"
      backUrl="/admin/languages"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <CardTitle className="text-2xl text-amber-900">{language.name}</CardTitle>
                  <p className="text-amber-600">Language Code: {language.code.toUpperCase()}</p>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/admin/languages/${languageId}/edit`)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Language
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">{language.description}</p>
          </CardContent>
        </Card>

        {/* Language Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Courses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{courses.length}</p>
              <p className="text-sm text-amber-600">Total courses</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Language Code</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="bg-amber-100 text-amber-800" variant="outline">
                {language.code.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Flag Image */}
        {language.flagImage && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle>Flag Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={language.flagImage} 
                alt={`${language.name} flag`}
                className="w-32 h-20 object-cover rounded-lg border border-amber-200"
              />
            </CardContent>
          </Card>
        )}

        {/* Courses List */}
        {courses.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Courses in {language.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 border border-amber-200 rounded-lg">
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">{course.title}</p>
                      <p className="text-sm text-amber-600">{course.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      <Badge className={course.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {course.active ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {courses.length === 0 && (
          <Card className="border-amber-200">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 text-amber-400 mx-auto mb-4">📚</div>
              <h3 className="text-lg font-medium text-amber-900 mb-2">No courses yet</h3>
              <p className="text-amber-600">This language doesn't have any courses yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </FormLayout>
  );
}
