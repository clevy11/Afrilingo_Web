
import React, { useState } from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { challengeService, CreateChallengeRequest } from '@/services/challengeService';

interface ChallengeFormData {
  title: string;
  courseId: string;
  minPassingScore: string;
  description: string;
}

export default function CreateChallengePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('CreateChallengePage: Component rendered');

  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('CreateChallengePage: Fetching courses...');
      try {
        const result = await courseService.getAll();
        console.log('CreateChallengePage: Courses fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('CreateChallengePage: Error fetching courses:', error);
        throw error;
      }
    },
  });

  const form = useForm<ChallengeFormData>({
    defaultValues: {
      title: '',
      courseId: '',
      minPassingScore: '70',
      description: '',
    },
  });

  const onSubmit = async (data: ChallengeFormData) => {
    console.log('CreateChallengePage: Form submitted with data:', data);
    setIsSubmitting(true);
    
    try {
      const challengeData: CreateChallengeRequest = {
        title: data.title,
        description: data.description,
        minPassingScore: parseInt(data.minPassingScore),
        course: {
          id: parseInt(data.courseId),
        },
      };

      console.log('CreateChallengePage: Sending challenge creation request:', challengeData);
      const result = await challengeService.create(challengeData);
      console.log('CreateChallengePage: Challenge created successfully:', result);
      
      // Invalidate challenges query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      toast({
        title: "Challenge Created Successfully!",
        description: `"${data.title}" is now available for students to attempt.`,
      });
      
      navigate('/admin/challenges');
    } catch (error) {
      console.error('CreateChallengePage: Failed to create challenge:', error);
      toast({
        title: "Failed to Create Challenge",
        description: "There was an error creating the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find(course => course.id === parseInt(form.watch('courseId')));

  console.log('CreateChallengePage: Current state:', {
    coursesLoading,
    coursesError,
    coursesCount: courses.length,
    selectedCourse,
    isSubmitting
  });

  if (coursesError) {
    console.error('CreateChallengePage: Courses error:', coursesError);
    return (
      <FormLayout
        title="Create New Challenge"
        description="Design exciting challenges to motivate your students"
        backUrl="/admin/challenges"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load courses. Please try again.</p>
          <p className="text-sm mt-2">Check the console for more details.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Create New Challenge"
      description="Design exciting challenges to motivate your students"
      backUrl="/admin/challenges"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Challenge title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Conversation Master Challenge" 
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
              name="courseId"
              rules={{ required: "Please select a course" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} disabled={coursesLoading}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select course"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>📚</span>
                            <span>{course.title}</span>
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
                      placeholder="e.g., 80" 
                      type="number"
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
            rules={{ required: "Challenge description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe the challenge and what students need to accomplish..."
                    className="flex min-h-[100px] w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCourse && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">Selected Course</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium text-amber-800">{selectedCourse.title}</p>
                  <p className="text-sm text-amber-600">{selectedCourse.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-amber-200">
            <Button 
              type="button" 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => navigate('/admin/challenges')}
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
                  <Trophy className="h-4 w-4 mr-2" />
                  Create Challenge
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
