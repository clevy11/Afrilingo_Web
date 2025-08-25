import React, { useState } from 'react';
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
import { useNavigate, Link } from 'react-router-dom';
import { questionService, CreateQuestionRequest } from '@/services/questionService';
import { useQuery } from '@tanstack/react-query';
import { quizService, Quiz } from '@/services/quizService';
import { Select as QuizSelect } from '@/components/ui/select';

interface QuestionOption {
  optionText: string;
  optionMedia?: string;
  correct: boolean;
}

export default function CreateQuestionPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateQuestionRequest>({
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    mediaUrl: '',
    points: 1,
    options: []
  });

  const [options, setOptions] = useState<QuestionOption[]>([
    { optionText: '', optionMedia: '', correct: false },
    { optionText: '', optionMedia: '', correct: false }
  ]);

  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: quizService.getAll,
  });

  const handleInputChange = (field: keyof CreateQuestionRequest, value: any) => {
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
    setOptions(prev => [...prev, { optionText: '', optionMedia: '', correct: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    if (formData.questionType === 'TRUE_FALSE' || formData.questionType === 'MULTIPLE_CHOICE') {
      if (formData.questionType === 'TRUE_FALSE') {
        setOptions(prev => prev.map((option, i) => ({
          ...option,
          correct: i === index ? isCorrect : false
        })));
      } else {
        handleOptionChange(index, 'correct', isCorrect);
      }
    }
  };

  // Utility to clean undefined and empty string fields
  function clean(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== "")
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedQuizId) {
        toast({
          title: 'Validation Error',
          description: 'Please select a quiz to associate with this question.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      // Validate that at least one option is correct for MULTIPLE_CHOICE and TRUE_FALSE
      if (formData.questionType !== 'FILL_BLANK') {
        const hasCorrectAnswer = options.some(option => option.correct && option.optionText.trim());
        if (!hasCorrectAnswer) {
          toast({
            title: "Validation Error",
            description: "Please mark at least one option as correct.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      // Filter out empty options and clean data
      const validOptions = options
        .filter(option => option.optionText.trim())
        .map(option => ({
          id: null,
          optionText: option.optionText.trim(),
          optionMedia: option.optionMedia?.trim() || "",
          correct: option.correct
        }));
      const questionData = {
        id: null,
        questionText: formData.questionText.trim(),
        questionType: formData.questionType,
        mediaUrl: formData.mediaUrl?.trim() || "",
        points: formData.points,
        quiz: { id: selectedQuizId },
        options: formData.questionType === 'FILL_BLANK' ? [] : validOptions
      };
      console.log('Sending strict question data:', questionData);
      await questionService.create(questionData);
      toast({
        title: "Question Created",
        description: "The question has been created successfully.",
      });
      navigate('/admin/questions');
    } catch (error) {
      console.error('Create question error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create question. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adjust options based on question type
  React.useEffect(() => {
    if (formData.questionType === 'TRUE_FALSE') {
      setOptions([
        { optionText: 'True', optionMedia: '', correct: false },
        { optionText: 'False', optionMedia: '', correct: false }
      ]);
    } else if (formData.questionType === 'FILL_BLANK') {
      setOptions([]);
    } else if (formData.questionType === 'MULTIPLE_CHOICE' && options.length < 2) {
      setOptions([
        { optionText: '', optionMedia: '', correct: false },
        { optionText: '', optionMedia: '', correct: false }
      ]);
    }
  }, [formData.questionType]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/questions">
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Create Question</h1>
            <p className="text-amber-700">Add a new question to your quiz bank</p>
          </div>
        </div>

        <Card className="border-amber-200 max-w-4xl">
          <CardContent className="p-6">
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
                      <Label htmlFor="quiz">Quiz</Label>
                      <QuizSelect
                        value={selectedQuizId ? String(selectedQuizId) : ''}
                        onValueChange={val => setSelectedQuizId(Number(val))}
                        disabled={quizzesLoading}
                      >
                        <SelectTrigger className="border-amber-300 focus:border-amber-500">
                          <SelectValue placeholder="Select quiz" />
                        </SelectTrigger>
                        <SelectContent>
                          {quizzes.map((quiz: Quiz) => (
                            <SelectItem key={quiz.id} value={String(quiz.id)}>
                              {quiz.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </QuizSelect>
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
                      <div key={index} className="flex items-center gap-4 p-4 border border-amber-200 rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option.optionText}
                            onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                            className="border-amber-300 focus:border-amber-500"
                            required
                            disabled={formData.questionType === 'TRUE_FALSE'}
                          />
                          <Input
                            placeholder="Media URL (optional)"
                            value={option.optionMedia}
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
                  {isLoading ? 'Creating...' : 'Create Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
