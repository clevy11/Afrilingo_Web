import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { questionService, Question, QuestionOption } from '@/services/questionService';

export default function EditQuestionPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: question, isLoading: isLoadingQuestion, error } = useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getById(Number(id)),
    enabled: !!id,
  });

  const [formData, setFormData] = useState<{
    questionText: string;
    questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
    mediaUrl: string;
    points: number;
  }>({
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    mediaUrl: '',
    points: 1,
  });

  const [options, setOptions] = useState<QuestionOption[]>([]);

  useEffect(() => {
    if (question) {
      setFormData({
        questionText: question.questionText,
        questionType: question.questionType,
        mediaUrl: question.mediaUrl || '',
        points: question.points,
      });
      setOptions(question.options || []);
    }
  }, [question]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, field: keyof QuestionOption, value: any) => {
    setOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    ));
  };

  const addOption = () => {
    setOptions(prev => [...prev, { 
      id: 0, 
      optionText: '', 
      optionMedia: '', 
      correct: false 
    }]);
  };

  const removeOption = async (index: number) => {
    const option = options[index];
    
    if (option.id && option.id > 0) {
      // This is an existing option, delete it from the backend
      try {
        await questionService.deleteOption(Number(id), option.id);
        toast({
          title: "Option Deleted",
          description: "The option has been removed successfully.",
        });
      } catch (error) {
        console.error('Delete option error:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete option. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Remove from local state
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    if (formData.questionType === 'TRUE_FALSE') {
      // For TRUE_FALSE, only allow one correct answer
      setOptions(prev => prev.map((option, i) => ({
        ...option,
        correct: i === index ? isCorrect : false
      })));
    } else {
      handleOptionChange(index, 'correct', isCorrect);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate that at least one option is correct for MULTIPLE_CHOICE and TRUE_FALSE
      if (formData.questionType !== 'FILL_BLANK') {
        const hasCorrectAnswer = options.some(option => option.correct && option.optionText.trim());
        if (!hasCorrectAnswer) {
          toast({
            title: "Validation Error",
            description: "Please mark at least one option as correct.",
            variant: "destructive",
          });
          return;
        }
      }

      // Update the question
      await questionService.update(Number(id), formData);

      // Handle options for new question types that support them
      if (formData.questionType !== 'FILL_BLANK') {
        // Add new options (those without an id or with id = 0)
        for (const option of options) {
          if (!option.id || option.id === 0) {
            await questionService.addOption(Number(id), {
              optionText: option.optionText,
              optionMedia: option.optionMedia,
              correct: option.correct
            });
          }
        }
      }
      
      toast({
        title: "Question Updated",
        description: "The question has been updated successfully.",
      });
      
      navigate('/admin/questions');
    } catch (error) {
      console.error('Update question error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingQuestion) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-amber-700">Loading question...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !question) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          <p>Failed to load question. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/admin/questions">
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Edit Question</h1>
            <p className="text-amber-700">Edit the details of this question</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  placeholder="Enter your question..."
                  value={formData.questionText}
                  onChange={(e) => handleInputChange('questionText', e.target.value)}
                  className="border-amber-300 focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select 
                    value={formData.questionType} 
                    onValueChange={(value) => handleInputChange('questionType', value)}
                  >
                    <SelectTrigger className="border-amber-300 focus:border-amber-500">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    placeholder="Enter points"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
                    className="border-amber-300 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
                <Input
                  id="mediaUrl"
                  type="url"
                  placeholder="Enter media URL..."
                  value={formData.mediaUrl}
                  onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {formData.questionType !== 'FILL_BLANK' && (
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-900">Answer Options</CardTitle>
                  {formData.questionType === 'MULTIPLE_CHOICE' && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addOption}
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {options.map((option, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-4 p-4 border border-amber-200 rounded-lg">
                    <div className="flex-1 min-w-0 space-y-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.optionText}
                        onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                        className="border-amber-300 focus:border-amber-500"
                        required
                      />
                      <Input
                        placeholder="Media URL (optional)"
                        value={option.optionMedia || ''}
                        onChange={(e) => handleOptionChange(index, 'optionMedia', e.target.value)}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={option.correct}
                        onCheckedChange={(checked) => handleCorrectChange(index, checked)}
                      />
                      <Label className="text-sm">Correct</Label>
                    </div>

                    {formData.questionType === 'MULTIPLE_CHOICE' && options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/questions')}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? 'Updating...' : 'Update Question'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
