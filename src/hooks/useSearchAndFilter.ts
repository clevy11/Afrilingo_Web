
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UseSearchAndFilterProps {
  initialQuery?: string;
  initialFilters?: Record<string, string>;
  onSearch?: (query: string, filters: Record<string, string>) => void;
}

export function useSearchAndFilter({
  initialQuery = '',
  initialFilters = {},
  onSearch
}: UseSearchAndFilterProps = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  }, [toast]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() && Object.values(filters).every(v => !v)) {
      toast({
        title: "Search Required",
        description: "Please enter a search term or apply filters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (onSearch) {
        await onSearch(searchQuery, filters);
      }
      
      toast({
        title: "Search Complete",
        description: `Searching for: "${searchQuery}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, onSearch, toast]);

  return {
    searchQuery,
    filters,
    isLoading,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
    hasActiveFilters: Object.values(filters).some(value => value && value !== ''),
  };
}
