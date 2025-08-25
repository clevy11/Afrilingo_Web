
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, BarChart, Edit, Trash2 } from 'lucide-react';

interface QuizCardProps {
  quiz: {
    id: number;
    title: string;
    questions: number;
    attempts: number;
    avgScore: number;
    status: string;
  };
  onViewQuiz: (id: number, title: string) => void;
  onViewResults: (id: number, title: string) => void;
  onEditQuiz: (id: number, title: string) => void;
  onDeleteQuiz: (id: number, title: string) => void;
}

export function QuizCard({ quiz, onViewQuiz, onViewResults, onEditQuiz, onDeleteQuiz }: QuizCardProps) {
  return (
    <Card className="border-amber-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-amber-900 flex-1 min-w-0">
            <span className="truncate">{quiz.title}</span>
          </CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
            quiz.status === 'Published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {quiz.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-amber-900">{quiz.questions}</div>
              <div className="text-xs text-amber-600">Questions</div>
            </div>
            <div>
              <div className="text-xl font-bold text-amber-900">{quiz.attempts}</div>
              <div className="text-xs text-amber-600">Attempts</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-900">{quiz.avgScore}%</div>
            <div className="text-xs text-amber-600">Average Score</div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => onViewQuiz(quiz.id, quiz.title)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => onViewResults(quiz.id, quiz.title)}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Results
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => onEditQuiz(quiz.id, quiz.title)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => onDeleteQuiz(quiz.id, quiz.title)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
