import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedSearchFilter } from '@/components/admin/shared/AdvancedSearchFilter';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { questionService, Question } from '@/services/questionService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function QuestionsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
  } = useSearchAndFilter();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);

  const { data: questionsData, isLoading, error } = useQuery({
    queryKey: ['questions', page, size],
    queryFn: () => questionService.getPaginated(page, size),
  });

  console.log('Raw questions data:', questionsData);
  console.log('Type of questionsData:', typeof questionsData);
  console.log('Is array:', Array.isArray(questionsData));

  // Current page items
  const allQuestions: Question[] = Array.isArray((questionsData as any)?.content)
    ? ((questionsData as any).content as Question[])
    : Array.isArray(questionsData)
      ? (questionsData as Question[])
      : [];
  const totalPages = Number((questionsData as any)?.totalPages ?? 1);

  // Filter questions based on search query and filters
  const filteredQuestions = allQuestions.filter((question: Question) => {
    // Search filter
    const matchesSearch = !searchQuery ||
      question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.questionType.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = !filters.category ||
      question.questionType === filters.category;

    // Points filter
    const matchesPoints = !filters.difficulty ||
      (filters.difficulty === 'low' && question.points <= 5) ||
      (filters.difficulty === 'medium' && question.points > 5 && question.points <= 10) ||
      (filters.difficulty === 'high' && question.points > 10);

    return matchesSearch && matchesType && matchesPoints;
  });

  const filterOptions = {
    category: [
      { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
      { value: 'TRUE_FALSE', label: 'True/False' },
      { value: 'FILL_BLANK', label: 'Fill in the Blank' }
    ],
    difficulty: [
      { value: 'low', label: 'Low (≤5 pts)' },
      { value: 'medium', label: 'Medium (6-10 pts)' },
      { value: 'high', label: 'High (>10 pts)' }
    ]
  };

  const handleCreateQuestion = () => {
    navigate('/admin/questions/new');
  };

  const handleViewQuestion = (questionId: number) => {
    navigate(`/admin/questions/${questionId}/view`);
  };

  const handleEditQuestion = (questionId: number) => {
    navigate(`/admin/questions/${questionId}/edit`);
  };

  const handleDeleteQuestion = async (questionId: number, questionText: string) => {
    if (window.confirm(`Are you sure you want to delete "${questionText}"? This action cannot be undone.`)) {
      try {
        await questionService.delete(questionId);
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        toast({
          title: "Question Deleted",
          description: `"${questionText}" has been deleted successfully.`,
        });
        window.location.reload();
      } catch (error) {
        console.error('Delete question error:', error);
        toast({
          title: "Delete Failed",
          description: `Failed to delete "${questionText}". Please try again.`,
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
            <p className="mt-2 text-amber-700">Loading questions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          <p>Failed to load questions. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Questions</h1>
            <p className="text-amber-700">Manage quiz questions and their options</p>
          </div>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleCreateQuestion}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Create Question
          </Button>
        </div>

        <AdvancedSearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search questions..."
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question: Question) => (
            <Card key={question.id} className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{getQuestionTypeIcon(question.questionType)}</span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-amber-900 break-words whitespace-normal">{question.questionText}</CardTitle>
                      <p className="text-sm text-amber-600 break-words whitespace-normal">{question.questionType.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Badge className={getQuestionTypeColor(question.questionType) + ' break-words whitespace-normal text-xs px-2 py-1'}>
                    {question.questionType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-amber-900">
                        {question.options?.length || 0}
                      </div>
                      <div className="text-xs text-amber-600">Options</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-amber-900">{question.points}</div>
                      <div className="text-xs text-amber-600">Points</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => handleViewQuestion(question.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteQuestion(question.id, question.questionText)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && allQuestions.length > 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">No questions found</h3>
            <p className="text-amber-600 mb-6">Try adjusting your search terms or filters.</p>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {allQuestions.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">No questions yet</h3>
            <p className="text-amber-600 mb-6">Get started by creating your first question.</p>
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleCreateQuestion}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Create Question
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3)).map((_, idx) => {
                const start = Math.max(0, page - 2);
                const pageNum = start + idx;
                if (pageNum >= totalPages) return null;
                const isActive = pageNum === page;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? 'default' : 'outline'}
                    className={isActive ? 'bg-amber-600 text-white' : 'border-amber-300 text-amber-700 hover:bg-amber-100'}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
