
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '@/services/quizService';
import { List, Target, BookOpen } from 'lucide-react';

export default function ViewQuizPage() {
  const { id } = useParams<{ id: string }>();
  const quizId = parseInt(id || '0');

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizService.getById(quizId),
    enabled: !!quizId,
  });

  if (isLoading) {
    return (
      <FormLayout
        title="View Quiz"
        description="Quiz details and content"
        backUrl="/admin/quizzes"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading quiz...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error || !quiz) {
    return (
      <FormLayout
        title="View Quiz"
        description="Quiz details and content"
        backUrl="/admin/quizzes"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load quiz. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title={quiz.title}
      description="Quiz Preview"
      backUrl="/admin/quizzes"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <List className="h-8 w-8 text-amber-600" />
                <div>
                  <CardTitle className="text-2xl text-amber-900">{quiz.title}</CardTitle>
                  <p className="text-amber-600">Lesson: {quiz.lesson.title}</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Quiz
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">{quiz.description}</p>
          </CardContent>
        </Card>

        {/* Quiz Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{quiz.questions?.length || 0}</p>
              <p className="text-sm text-amber-600">Total questions</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Minimum Passing Score</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{quiz.minPassingScore}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions Preview */}
        {quiz.questions && quiz.questions.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-amber-600" />
                Questions Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quiz.questions.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="p-4 border border-amber-200 rounded-lg">
                    <p className="font-medium text-amber-900 mb-2">
                      {index + 1}. {question.questionText}
                    </p>
                    <div className="flex items-center justify-between text-sm text-amber-600">
                      <span>Type: {question.questionType}</span>
                      <span>Points: {question.points}</span>
                    </div>
                    {question.options && question.options.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {question.options.slice(0, 2).map((option, optIndex) => (
                          <div key={option.id} className="text-sm text-amber-700 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${option.correct ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {option.optionText}
                          </div>
                        ))}
                        {question.options.length > 2 && (
                          <p className="text-xs text-amber-500">... and {question.options.length - 2} more options</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {quiz.questions.length > 3 && (
                  <p className="text-sm text-amber-600 text-center">
                    ... and {quiz.questions.length - 3} more questions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Information */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle>Associated Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-medium text-amber-800">{quiz.lesson.title}</p>
                <p className="text-sm text-amber-600">{quiz.lesson.description}</p>
                <p className="text-xs text-amber-500">
                  Course: {quiz.lesson.course.title}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}
