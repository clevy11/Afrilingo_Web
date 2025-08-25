
import React, { useState } from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Book } from 'lucide-react';
import { languageService, Language } from '@/services/languageService';
import { courseService, UpdateCourseRequest } from '@/services/courseService';
import { roleUtils } from '@/utils/roleUtils';

interface CourseFormData {
  title: string;
  languageId: string;
  level: string;
  description: string;
  image: string;
}

const levels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export default function EditCoursePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || '0');

  // Enforce view-only access for admins
  React.useEffect(() => {
    if (roleUtils.isAdmin() && courseId) {
      navigate(`/admin/courses/${courseId}/view`, { replace: true });
    }
  }, [courseId, navigate]);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getById(courseId),
    enabled: !!courseId,
  });

  const { data: languages = [], isLoading: languagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: languageService.getAll,
  });

  const form = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      languageId: '',
      level: '',
      description: '',
      image: '',
    },
  });

  React.useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        languageId: course.language.id.toString(),
        level: course.level,
        description: course.description,
        image: course.image,
      });
    }
  }, [course, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCourseRequest) => courseService.update(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast({
        title: "Course Updated Successfully!",
        description: "The course has been updated.",
      });
      navigate('/admin/courses');
    },
    onError: (error) => {
      console.error('Failed to update course:', error);
      toast({
        title: "Failed to Update Course",
        description: "There was an error updating the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    if (!course) return;
    
    const selectedLanguage = languages.find(lang => lang.id === parseInt(data.languageId));
    
    if (!selectedLanguage) {
      toast({
        title: "Error",
        description: "Selected language not found",
        variant: "destructive",
      });
      return;
    }

    const courseData: UpdateCourseRequest = {
      id: courseId,
      version: course.version,
      title: data.title,
      description: data.description,
      level: data.level,
      image: data.image || 'default-course.jpg',
      active: course.active,
      language: selectedLanguage,
    };

    updateMutation.mutate(courseData);
  };

  if (courseLoading || languagesLoading) {
    return (
      <FormLayout
        title="Edit Course"
        description="Update course information"
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

  if (courseError || !course) {
    return (
      <FormLayout
        title="Edit Course"
        description="Update course information"
        backUrl="/admin/courses"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load course. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  const selectedLanguage = languages.find(lang => lang.id === parseInt(form.watch('languageId')));

  return (
    <FormLayout
      title="Edit Course"
      description="Update course information"
      backUrl="/admin/courses"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Course title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Swahili Basics" 
                      className="border-amber-300 focus:border-amber-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languageId"
              rules={{ required: "Please select a language" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>🌍</span>
                            <span>{language.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              rules={{ required: "Please select a level" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Image (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., course-image.jpg" 
                      className="border-amber-300 focus:border-amber-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            rules={{ required: "Course description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe what students will learn in this course..."
                    className="flex min-h-[100px] w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedLanguage && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">Selected Language</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <p className="font-medium text-amber-800">{selectedLanguage.name}</p>
                  <p className="text-sm text-amber-600">{selectedLanguage.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-amber-200">
            <Button 
              type="button" 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => navigate('/admin/courses')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>Updating...</>
              ) : (
                <>
                  <Book className="h-4 w-4 mr-2" />
                  Update Course
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
