
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, Clock, Trophy } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  participants: number;
  duration: string;
  reward: string;
  status: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ChallengeCard({ challenge, onEdit, onDelete }: ChallengeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl text-amber-900">{challenge.title}</CardTitle>
            <CardDescription className="text-amber-700">{challenge.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(challenge.id)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(challenge.id)}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
          <Badge className={getStatusColor(challenge.status)}>
            {challenge.status}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-amber-700">
            <Users className="h-4 w-4" />
            {challenge.participants} participants
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-700">
            <Clock className="h-4 w-4" />
            {challenge.duration}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-700">
            <Trophy className="h-4 w-4" />
            {challenge.reward}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
