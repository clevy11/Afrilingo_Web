
import React, { useState } from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { List } from 'lucide-react';
import { lessonService } from '@/services/lessonService';
import { quizService, UpdateQuizRequest } from '@/services/quizService';

interface QuizFormData {
  title: string;
  lessonId: string;
  minPassingScore: string;
  description: string;
}

export default function EditQuizPage() {
  const { id } = useParams<{ id: string }>();
  const quizId = parseInt(id || '0');
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizService.getById(quizId),
    enabled: !!quizId,
  });

  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAll,
  });

  const form = useForm<QuizFormData>({
    defaultValues: {
      title: '',
      lessonId: '',
      minPassingScore: '',
      description: '',
    },
  });

  // Update form when quiz data is loaded
  React.useEffect(() => {
    if (quiz) {
      form.reset({
        title: quiz.title,
        lessonId: quiz.lesson.id.toString(),
        minPassingScore: quiz.minPassingScore.toString(),
        description: quiz.description,
      });
    }
  }, [quiz, form]);

  const onSubmit = async (data: QuizFormData) => {
    if (!quiz) return;
    
    setIsSubmitting(true);
    try {
      const quizData: UpdateQuizRequest = {
        id: quiz.id,
        title: data.title,
        description: data.description,
        minPassingScore: parseInt(data.minPassingScore),
        lesson: {
          id: parseInt(data.lessonId),
        },
      };

      await quizService.update(quiz.id, quizData);
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      
      toast({
        title: "Quiz Updated Successfully!",
        description: `"${data.title}" has been updated.`,
      });
      
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('EditQuizPage: Failed to update quiz:', error);
      toast({
        title: "Failed to Update Quiz",
        description: "There was an error updating the quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLesson = lessons.find(lesson => lesson.id === parseInt(form.watch('lessonId')));

  if (quizLoading || lessonsLoading) {
    return (
      <FormLayout
        title="Edit Quiz"
        description="Update quiz details and settings"
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

  if (quizError || lessonsError || !quiz) {
    return (
      <FormLayout
        title="Edit Quiz"
        description="Update quiz details and settings"
        backUrl="/admin/quizzes"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load quiz data. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Edit Quiz"
      description="Update quiz details and settings"
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select lesson" />
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
                <>Updating...</>
              ) : (
                <>
                  <List className="h-4 w-4 mr-2" />
                  Update Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
