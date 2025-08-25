
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '@/services/challengeService';
import { Trophy, Target, BookOpen, List } from 'lucide-react';

export default function ViewChallengePage() {
  const { id } = useParams<{ id: string }>();
  const challengeId = parseInt(id || '0');

  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => challengeService.getById(challengeId),
    enabled: !!challengeId,
  });

  if (isLoading) {
    return (
      <FormLayout
        title="View Challenge"
        description="Challenge details and content"
        backUrl="/admin/challenges"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading challenge...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error || !challenge) {
    return (
      <FormLayout
        title="View Challenge"
        description="Challenge details and content"
        backUrl="/admin/challenges"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load challenge. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <FormLayout
      title={challenge.title}
      description="Challenge Preview"
      backUrl="/admin/challenges"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-600" />
                <div>
                  <CardTitle className="text-2xl text-amber-900">{challenge.title}</CardTitle>
                  <p className="text-amber-600">Course: {challenge.course.title}</p>
                </div>
              </div>
              <Badge className={getDifficultyColor(challenge.difficulty || 'medium')}>
                {challenge.difficulty || 'Challenge'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">{challenge.description}</p>
          </CardContent>
        </Card>

        {/* Challenge Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg">Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{challenge.questions?.length || 0}</p>
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
              <p className="text-2xl font-bold text-amber-900">{challenge.minPassingScore || 70}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions Preview */}
        {challenge.questions && challenge.questions.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-amber-600" />
                Questions Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.questions.slice(0, 3).map((question, index) => (
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
                {challenge.questions.length > 3 && (
                  <p className="text-sm text-amber-600 text-center">
                    ... and {challenge.questions.length - 3} more questions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Information */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle>Associated Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-medium text-amber-800">{challenge.course.title}</p>
                <p className="text-sm text-amber-600">{challenge.course.description}</p>
                <p className="text-xs text-amber-500">
                  {challenge.course.language.name} • {challenge.course.level}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}
