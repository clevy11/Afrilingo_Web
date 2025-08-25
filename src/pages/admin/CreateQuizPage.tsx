
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
import { List } from 'lucide-react';
import { lessonService } from '@/services/lessonService';
import { quizService, CreateQuizRequest } from '@/services/quizService';

interface QuizFormData {
  title: string;
  lessonId: string;
  minPassingScore: string;
  description: string;
}

export default function CreateQuizPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('CreateQuizPage: Component rendered');

  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      console.log('CreateQuizPage: Fetching lessons...');
      try {
        const result = await lessonService.getAll();
        console.log('CreateQuizPage: Lessons fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('CreateQuizPage: Error fetching lessons:', error);
        throw error;
      }
    },
  });

  const form = useForm<QuizFormData>({
    defaultValues: {
      title: '',
      lessonId: '',
      minPassingScore: '',
      description: '',
    },
  });

  const onSubmit = async (data: QuizFormData) => {
    console.log('CreateQuizPage: Form submitted with data:', data);
    setIsSubmitting(true);
    
    try {
      const quizData: CreateQuizRequest = {
        title: data.title,
        description: data.description,
        minPassingScore: parseInt(data.minPassingScore),
        lesson: {
          id: parseInt(data.lessonId),
        },
      };

      console.log('CreateQuizPage: Sending quiz creation request:', quizData);
      const result = await quizService.create(quizData);
      console.log('CreateQuizPage: Quiz created successfully:', result);
      
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      
      toast({
        title: "Quiz Created Successfully!",
        description: `"${data.title}" has been created and is ready for questions.`,
      });
      
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('CreateQuizPage: Failed to create quiz:', error);
      toast({
        title: "Failed to Create Quiz",
        description: "There was an error creating the quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLesson = lessons.find(lesson => lesson.id === parseInt(form.watch('lessonId')));

  console.log('CreateQuizPage: Current state:', {
    lessonsLoading,
    lessonsError,
    lessonsCount: lessons.length,
    selectedLesson,
    isSubmitting
  });

  if (lessonsError) {
    console.error('CreateQuizPage: Lessons error:', lessonsError);
    return (
      <FormLayout
        title="Create New Quiz"
        description="Build interactive quizzes to test student knowledge"
        backUrl="/admin/quizzes"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load lessons. Please try again.</p>
          <p className="text-sm mt-2">Check the console for more details.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Create New Quiz"
      description="Build interactive quizzes to test student knowledge"
      backUrl="/admin/quizzes"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Quiz title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Greetings Quiz" 
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
              name="lessonId"
              rules={{ required: "Please select a lesson" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson</FormLabel>
                  <Select onValueChange={field.onChange} disabled={lessonsLoading}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder={lessonsLoading ? "Loading lessons..." : "Select lesson"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>📖</span>
                            <span>{lesson.title}</span>
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
              name="minPassingScore"
              rules={{ required: "Minimum passing score is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 70" 
                      type="number"
                      min="0"
                      max="100"
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
            rules={{ required: "Quiz description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe what this quiz covers..."
                    className="flex min-h-[100px] w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedLesson && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">Selected Lesson</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="font-medium text-amber-800">{selectedLesson.title}</p>
                  <p className="text-sm text-amber-600">{selectedLesson.description}</p>
                  <p className="text-xs text-amber-500">Course: {selectedLesson.course.title}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-amber-200">
            <Button 
              type="button" 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => navigate('/admin/quizzes')}
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
                  <List className="h-4 w-4 mr-2" />
                  Create Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
