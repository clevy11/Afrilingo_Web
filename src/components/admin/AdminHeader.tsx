
import React, { useState } from 'react';
import { Search, User, Settings, Bell, Menu, LogOut } from 'lucide-react';
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

  const handleNotificationClick = () => {
    navigate('/admin/notifications');
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
    <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 transition-colors" />
          <h1 className="text-xl sm:text-2xl font-bold text-amber-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input 
              placeholder="Search courses, quizzes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 lg:w-80 border-amber-300 focus:border-amber-500 bg-white/70"
            />
          </form>
          
          {/* Mobile search button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="sm:hidden border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={() => toast({ title: "Search", description: "Mobile search coming soon!" })}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="outline" 
            size="icon" 
            className="border-amber-300 text-amber-700 hover:bg-amber-100 relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </Button>
          
          {/* Settings */}
          <Button 
            variant="outline" 
            size="icon" 
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
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
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-amber-200 z-50">
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
