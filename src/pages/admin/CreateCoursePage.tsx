
import React, { useState } from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Book } from 'lucide-react';
import { languageService, Language } from '@/services/languageService';
import { courseService, CreateCourseRequest } from '@/services/courseService';

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

export default function CreateCoursePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('CreateCoursePage: Component rendered');

  const { data: languages = [], isLoading: languagesLoading, error: languagesError } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('CreateCoursePage: Fetching languages...');
      try {
        const result = await languageService.getAll();
        console.log('CreateCoursePage: Languages fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('CreateCoursePage: Error fetching languages:', error);
        throw error;
      }
    },
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

  const onSubmit = async (data: CourseFormData) => {
    console.log('CreateCoursePage: Form submitted with data:', data);
    setIsSubmitting(true);
    
    try {
      const selectedLanguage = languages.find(lang => lang.id === parseInt(data.languageId));
      
      if (!selectedLanguage) {
        throw new Error('Selected language not found');
      }

      const courseData: CreateCourseRequest = {
        title: data.title,
        description: data.description,
        level: data.level,
        image: data.image || 'default-course.jpg',
        active: true,
        language: selectedLanguage,
      };

      console.log('CreateCoursePage: Sending course creation request:', courseData);
      const result = await courseService.create(courseData);
      console.log('CreateCoursePage: Course created successfully:', result);
      
      // Invalidate courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: "Course Created Successfully!",
        description: `"${data.title}" has been created and is ready for lessons.`,
      });
      
      navigate('/admin/courses');
    } catch (error) {
      console.error('CreateCoursePage: Failed to create course:', error);
      toast({
        title: "Failed to Create Course",
        description: "There was an error creating the course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLanguage = languages.find(lang => lang.id === parseInt(form.watch('languageId')));

  console.log('CreateCoursePage: Current state:', {
    languagesLoading,
    languagesError,
    languagesCount: languages.length,
    selectedLanguage,
    isSubmitting
  });

  if (languagesError) {
    console.error('CreateCoursePage: Languages error:', languagesError);
    return (
      <FormLayout
        title="Create New Course"
        description="Set up a new language course for your students"
        backUrl="/admin/courses"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load languages. Please try again.</p>
          <p className="text-sm mt-2">Check the console for more details.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Create New Course"
      description="Set up a new language course for your students"
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
                  <Select onValueChange={field.onChange} disabled={languagesLoading}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder={languagesLoading ? "Loading languages..." : "Select language"} />
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
                  <Select onValueChange={field.onChange}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Book className="h-4 w-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
