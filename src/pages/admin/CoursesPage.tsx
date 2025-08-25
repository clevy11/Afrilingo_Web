import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService, Course } from '@/services/courseService';
import { AdvancedSearchFilter } from '@/components/admin/shared/AdvancedSearchFilter';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { roleUtils } from '@/utils/roleUtils';

export default function CoursesPage() {
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

  const { data: allCourses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
  });

  // Filter courses based on search query and filters
  const filteredCourses = allCourses.filter((course: Course) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && course.active) ||
      (filters.status === 'inactive' && !course.active);

    // Level filter (using difficulty as level)
    const matchesLevel = !filters.difficulty || 
      course.level.toLowerCase() === filters.difficulty.toLowerCase();

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const filterOptions = {
    status: [
      { value: 'active', label: 'Published' },
      { value: 'inactive', label: 'Draft' }
    ],
    difficulty: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ]
  };

  const handleEditCourse = (courseId: number) => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async (courseId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await courseService.delete(courseId);
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        toast({
          title: "Course Deleted",
          description: `"${title}" has been deleted successfully.`,
        });
        window.location.reload();
      } catch (error) {
        console.error('Delete course error:', error);
        toast({
          title: "Delete Failed",
          description: `Failed to delete "${title}". Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/admin/courses/${courseId}/view`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading courses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          <p>Failed to load courses. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Courses</h1>
            <p className="text-amber-700">Manage your language courses</p>
          </div>
          {!isAdmin && (
            <Link to="/admin/courses/new">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </Link>
          )}
        </div>

        <AdvancedSearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search courses..."
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🌍</div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-amber-900 truncate">{course.title}</CardTitle>
                      <p className="text-sm text-amber-600">{course.language.name} • {course.level}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    course.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.active ? 'Published' : 'Draft'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-amber-700 line-clamp-2">{course.description}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => handleViewCourse(course.id)}
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
                          onClick={() => handleEditCourse(course.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-300 text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteCourse(course.id, course.title)}
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

        {filteredCourses.length === 0 && allCourses.length > 0 && (
          <div className="text-center py-12">
            <div className="h-12 w-12 text-amber-400 mx-auto mb-4">📚</div>
            <h3 className="text-lg font-medium text-amber-900 mb-2">No courses found</h3>
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

        {allCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="h-12 w-12 text-amber-400 mx-auto mb-4">📚</div>
            <h3 className="text-lg font-medium text-amber-900 mb-2">No courses yet</h3>
            <p className="text-amber-600 mb-6">Get started by creating your first course.</p>
            {!isAdmin && (
              <Link to="/admin/courses/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
