
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onFilter: () => void;
  placeholder?: string;
}

export function SearchFilter({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onFilter, 
  placeholder = "Search..." 
}: SearchFilterProps) {
  return (
    <Card className="border-amber-200">
      <CardContent className="p-6">
        <form onSubmit={onSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input 
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-amber-300 focus:border-amber-500"
            />
          </div>
          <Button 
            type="submit"
            variant="outline" 
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Search
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
