import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { questionService } from '@/services/questionService';

export default function ViewQuestionPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: question, isLoading, error } = useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getById(Number(id)),
    enabled: !!id,
  });

  const handleEdit = () => {
    navigate(`/admin/questions/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!question) return;
    
    if (window.confirm(`Are you sure you want to delete "${question.questionText}"? This action cannot be undone.`)) {
      try {
        await questionService.delete(Number(id));
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        toast({
          title: "Question Deleted",
          description: `"${question.questionText}" has been deleted successfully.`,
        });
        navigate('/admin/questions');
      } catch (error) {
        console.error('Delete question error:', error);
        toast({
          title: "Delete Failed",
          description: `Failed to delete "${question.questionText}". Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return '📝';
      case 'TRUE_FALSE': return '✅';
      case 'FILL_BLANK': return '✏️';
      default: return '❓';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'bg-blue-100 text-blue-800';
      case 'TRUE_FALSE': return 'bg-green-100 text-green-800';
      case 'FILL_BLANK': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading question...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !question) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          <p>Failed to load question. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/admin/questions">
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">View Question</h1>
            <p className="text-amber-700">View details of this question</p>
          </div>
        </div>

        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getQuestionTypeIcon(question.questionType)}</span>
                <div>
                  <CardTitle className="text-xl text-amber-900">{question.questionText}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getQuestionTypeColor(question.questionType)}>
                      {question.questionType.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="border-amber-300 text-amber-700">
                      {question.points} {question.points === 1 ? 'Point' : 'Points'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEdit}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDelete}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {question.mediaUrl && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-amber-900 mb-2">Media</h4>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <a 
                    href={question.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline text-sm break-all"
                  >
                    {question.mediaUrl}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {question.questionType !== 'FILL_BLANK' && question.options && question.options.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Answer Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                      option.correct 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium text-sm text-amber-900">
                        Option {index + 1}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <p className={`text-sm ${option.correct ? 'text-green-800' : 'text-amber-800'}`}>
                        {option.optionText}
                      </p>
                      {option.optionMedia && (
                        <a 
                          href={option.optionMedia} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-amber-600 hover:underline mt-1 block"
                        >
                          Media: {option.optionMedia}
                        </a>
                      )}
                    </div>

                    {option.correct && (
                      <Badge className="bg-green-100 text-green-800">
                        Correct Answer
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {question.questionType === 'FILL_BLANK' && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Fill in the Blank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-800 text-sm">
                  This is a fill-in-the-blank question. Students will need to provide their own answer.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
