
import React, { useState } from 'react';
import { Search, User, Settings, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for: "${searchQuery}"`,
      });
    }
  };

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-amber-800 dark:text-gray-300 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100 dark:hover:bg-white/10 transition-colors" />
          <h1 className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-gray-100">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-gray-400" />
            <Input
              placeholder="Search courses, quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 lg:w-80 border-border focus:border-primary bg-card/70 dark:bg-white/5 dark:placeholder:text-gray-500"
            />
          </form>

          {/* Mobile search button */}
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden border-border text-amber-700 dark:text-gray-300 hover:bg-card/95 dark:hover:bg-white/10"
            onClick={() => toast({ title: "Search", description: "Mobile search coming soon!" })}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button
            variant="outline"
            size="icon"
            className="border-border text-amber-700 dark:text-gray-300 hover:bg-card/95 dark:hover:bg-white/10"
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border text-amber-700 dark:text-gray-300 hover:bg-card/95 dark:hover:bg-white/10"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
