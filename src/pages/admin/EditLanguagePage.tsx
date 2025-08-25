
import React from 'react';
import { FormLayout } from '@/components/admin/FormLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { languageService, UpdateLanguageRequest } from '@/services/languageService';

const formSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  code: z.string().min(2, 'Language code must be at least 2 characters').max(3, 'Language code must be at most 3 characters'),
  description: z.string().min(1, 'Description is required'),
  flagImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function EditLanguagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const languageId = parseInt(id || '0');

  const { data: language, isLoading, error } = useQuery({
    queryKey: ['language', languageId],
    queryFn: () => languageService.getById(languageId),
    enabled: !!languageId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      flagImage: '',
    },
  });

  React.useEffect(() => {
    if (language) {
      form.reset({
        name: language.name,
        code: language.code,
        description: language.description,
        flagImage: language.flagImage || '',
      });
    }
  }, [language, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLanguageRequest) => languageService.update(languageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      queryClient.invalidateQueries({ queryKey: ['language', languageId] });
      toast({
        title: "Language Updated",
        description: "The language has been updated successfully.",
      });
      navigate('/admin/languages');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update language. Please try again.",
        variant: "destructive",
      });
      console.error('Update language error:', error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const languageData: UpdateLanguageRequest = {
      id: languageId,
      name: values.name,
      code: values.code.toLowerCase(),
      description: values.description,
      flagImage: values.flagImage || '',
    };
    
    updateMutation.mutate(languageData);
  };

  if (isLoading) {
    return (
      <FormLayout
        title="Edit Language"
        description="Update language information"
        backUrl="/admin/languages"
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading language...</p>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (error || !language) {
    return (
      <FormLayout
        title="Edit Language"
        description="Update language information"
        backUrl="/admin/languages"
      >
        <div className="text-center text-red-600 p-8">
          <p>Failed to load language. Please try again.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Edit Language"
      description="Update language information"
      backUrl="/admin/languages"
    >
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle>Language Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., English, French, Spanish"
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., en, fr, es"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this language..."
                        rows={4}
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
                name="flagImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/flag.png"
                        className="border-amber-300 focus:border-amber-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Language'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => navigate('/admin/languages')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </FormLayout>
  );
}
