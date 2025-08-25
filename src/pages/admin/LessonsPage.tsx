import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdvancedSearchFilter } from '@/components/admin/shared/AdvancedSearchFilter';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { lessonService, Lesson } from '@/services/lessonService';
import { roleUtils } from '@/utils/roleUtils';

export default function LessonsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = roleUtils.isAdmin();

  const {
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
  } = useSearchAndFilter();

  const { data: allLessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAll,
  });

  // Filter lessons based on search query and filters
  const filteredLessons = allLessons.filter((lesson: Lesson) => {
    // Search filter
    const matchesSearch = !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.course.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = !filters.category ||
      lesson.type.toLowerCase() === filters.category.toLowerCase();

    // Status filter (required vs optional)
    const matchesStatus = !filters.status ||
      (filters.status === 'required' && lesson.required) ||
      (filters.status === 'optional' && !lesson.required);

    return matchesSearch && matchesType && matchesStatus;
  });

  const filterOptions = {
    status: [
      { value: 'required', label: 'Required' },
      { value: 'optional', label: 'Optional' }
    ],
    category: [
      { value: 'audio', label: 'Audio' },
      { value: 'reading', label: 'Reading' },
      { value: 'image_object', label: 'Image Object' }
    ]
  };

  const handleCreateLesson = () => {
    navigate('/admin/lessons/new');
  };

  const handleViewLesson = (lessonId: number) => {
    navigate(`/admin/lessons/${lessonId}/view`);
  };

  const handleEditLesson = (lessonId: number) => {
    navigate(`/admin/lessons/${lessonId}/edit`);
  };

  const handleDeleteLesson = async (lessonId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await lessonService.delete(lessonId);
        queryClient.invalidateQueries({ queryKey: ['lessons'] });
        toast({
          title: "Lesson Deleted",
          description: `"${title}" has been deleted successfully.`,
        });
        // Refresh the page immediately
        window.location.reload();
      } catch (error) {
        console.error('Delete lesson error:', error);
        toast({
          title: "Delete Failed",
          description: `Failed to delete "${title}". Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading lessons...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          <p>Failed to load lessons. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Lessons</h1>
            <p className="text-amber-700">Manage course lessons and content</p>
          </div>
          {!isAdmin && (
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleCreateLesson}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Create Lesson
            </Button>
          )}
        </div>

        <AdvancedSearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search lessons..."
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson: Lesson) => (
            <Card key={lesson.id} className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getLessonTypeIcon(lesson.type)}</span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-amber-900 truncate">{lesson.title}</CardTitle>
                      <p className="text-sm text-amber-600">Course: {lesson.course.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getLessonTypeColor(lesson.type)}>
                      {lesson.type}
                    </Badge>
                    {lesson.required && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-amber-700 line-clamp-2">{lesson.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-amber-600">
                    <span>Order: {lesson.orderIndex}</span>
                    <span>{(lesson.contents?.length ?? 0)} content(s)</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => handleViewLesson(lesson.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {!isAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                          onClick={() => handleEditLesson(lesson.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-300 text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLessons.length === 0 && allLessons.length > 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">No lessons found</h3>
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

        {allLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">No lessons yet</h3>
            <p className="text-amber-600 mb-6">Get started by creating your first lesson.</p>
            {!isAdmin && (
              <Button 
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleCreateLesson}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Create Lesson
              </Button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
