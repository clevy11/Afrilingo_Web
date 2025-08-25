
import React, { useState } from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, useFieldArray } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { lessonService, CreateLessonRequest } from '@/services/lessonService';

interface LessonFormData {
  title: string;
  courseId: string;
  type: 'AUDIO' | 'READING' | 'IMAGE_OBJECT';
  orderIndex: string;
  description: string;
  required: boolean;
  contents: Array<{
    contentType: 'TEXT' | 'AUDIO' | 'IMAGE_OBJECT';
    contentData: string;
    mediaUrl: string;
  }>;
}

const lessonTypes = [
  { value: 'AUDIO', label: 'Audio Lesson' },
  { value: 'READING', label: 'Reading Lesson' },
  { value: 'IMAGE_OBJECT', label: 'Image Object Lesson' },
] as const;

const contentTypes = [
  { value: 'TEXT', label: 'Text Content' },
  { value: 'AUDIO', label: 'Audio Content' },
  { value: 'IMAGE_OBJECT', label: 'Image Content' },
] as const;

export default function CreateLessonPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
  });

  const form = useForm<LessonFormData>({
    defaultValues: {
      title: '',
      courseId: '',
      type: 'READING',
      orderIndex: '1',
      description: '',
      required: true,
      contents: [{
        contentType: 'TEXT',
        contentData: '',
        mediaUrl: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contents',
  });

  const onSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);
    
    try {
      const lessonData: CreateLessonRequest = {
        title: data.title,
        description: data.description,
        type: data.type,
        orderIndex: parseInt(data.orderIndex),
        required: data.required,
        course: {
          id: parseInt(data.courseId),
        },
        contents: data.contents.filter(content => content.contentData.trim() !== ''),
      };

      console.log('Creating lesson with data:', lessonData);
      const result = await lessonService.create(lessonData);
      console.log('Lesson created successfully:', result);
      
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      
      toast({
        title: "Lesson Created Successfully!",
        description: `"${data.title}" has been created and is ready for students.`,
      });
      
      navigate('/admin/lessons');
    } catch (error) {
      console.error('Create lesson error:', error);
      toast({
        title: "Failed to Create Lesson",
        description: "There was an error creating the lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addContent = () => {
    append({ contentType: 'TEXT', contentData: '', mediaUrl: '' });
  };

  const removeContent = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const selectedCourse = courses.find(course => course.id === parseInt(form.watch('courseId')));

  if (coursesError) {
    return (
      <FormLayout
        title="Create New Lesson"
        description="Build engaging lessons for your students"
        backUrl="/admin/lessons"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load courses. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Create New Lesson"
      description="Build engaging lessons for your students"
      backUrl="/admin/lessons"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Lesson title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Introduction to Greetings" 
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
              name="type"
              rules={{ required: "Please select a lesson type" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select lesson type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessonTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="orderIndex"
              rules={{ required: "Order index is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Index</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 1" 
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
            rules={{ required: "Lesson description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe what students will learn in this lesson..."
                    className="flex min-h-[100px] w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Required Lesson</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Students must complete this lesson to progress
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-amber-900">Lesson Contents</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContent}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-amber-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-amber-800">Content {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContent(index)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`contents.${index}.contentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-amber-300 focus:border-amber-500">
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    name={`contents.${index}.mediaUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/media.mp3" 
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
                  name={`contents.${index}.contentData`}
                  rules={{ required: "Content data is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Data</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter the content data..."
                          className="flex min-h-[120px] w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

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
              onClick={() => navigate('/admin/lessons')}
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
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
