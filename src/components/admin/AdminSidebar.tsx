
import React from 'react';
import { LayoutDashboard, Book, Settings, User, Search, List, Users, BookOpen, Trophy, Bell, Globe, HelpCircle, type LucideIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { roleUtils } from '@/utils/roleUtils';

interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  color: string;
  adminOnly?: boolean;
  proctorOnly?: boolean;
}

const getAllMenuItems = (): SidebarItem[] => [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
    color: "from-blue-500 to-blue-600",
    adminOnly: true
  },
  {
    title: "Languages",
    url: "/admin/languages",
    icon: Globe,
    description: "Manage Languages",
    color: "from-emerald-500 to-emerald-600",
    adminOnly: false,
    proctorOnly: true
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: Book,
    description: "Rwanda Language",
    color: "from-green-500 to-green-600",
    adminOnly: false
  },
  {
    title: "Lessons",
    url: "/admin/lessons",
    icon: BookOpen,
    description: "Create & Edit",
    color: "from-purple-500 to-purple-600",
    adminOnly: false
  },
  {
    title: "Question Bank",
    url: "/admin/questions",
    icon: HelpCircle,
    description: "Quiz Questions",
    color: "from-indigo-500 to-indigo-600",
    proctorOnly: true
  },
  {
    title: "Quizzes",
    url: "/admin/quizzes",
    icon: List,
    description: "Quiz Management",
    color: "from-orange-500 to-orange-600",
    adminOnly: false,
    proctorOnly: true
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    description: "User Management",
    color: "from-indigo-500 to-indigo-600",
    adminOnly: true
  },
  {
    title: "Certificates",
    url: "/admin/certificates",
    icon: Trophy,
    description: "All issued certificates",
    color: "from-yellow-500 to-orange-500",
    adminOnly: true
  },
  {
    title: "Tutor Events",
    url: "/admin/proctor-events",
    icon: Bell,
    description: "All tutor monitoring events",
    color: "from-rose-500 to-red-600",
    adminOnly: true
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
    description: "My Profile",
    color: "from-teal-500 to-teal-600",
    adminOnly: false
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  
  // Filter menu items based on user role
  const menuItems = getAllMenuItems().filter((item: SidebarItem) => {
    if (item.adminOnly) {
      return roleUtils.isAdmin();
    }
    if (item.proctorOnly) {
      return roleUtils.isProctor();
    }
    // Visible to both Admin and Proctor
    return roleUtils.canAccessDashboard();
  });

  const handleUserClick = () => {
    toast({
      title: "User Profile",
      description: "User profile menu opened!",
    });
  };

  return (
    <Sidebar className="bg-gradient-to-br from-white via-amber-50 to-orange-100 border-r border-amber-200/60 shadow-xl backdrop-blur-sm transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-4 sm:p-6 border-b border-amber-200/40 bg-gradient-to-r from-amber-100/50 to-orange-100/30">
        <Link to="/" className="flex items-center gap-3 group hover:scale-[1.02] transition-all duration-300">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <img 
              src="/lovable-uploads/11afa540-f243-4c5a-93e4-f75f0daebf89.png" 
              alt="Gabalang Logo" 
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-lg ring-2 ring-white/50"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent truncate">
              Gabalang
            </h2>
            <p className="text-xs sm:text-sm text-amber-600 font-medium">{roleUtils.getUserDisplayTitle()}</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-700 font-bold px-4 py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
            <span>Kinyarwanda Hub</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        group relative overflow-hidden rounded-xl mx-2 transition-all duration-300 hover:shadow-lg
                        ${isActive 
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-[1.02] ring-2 ring-white/20` 
                          : 'text-amber-800 hover:bg-gradient-to-r hover:from-amber-100/60 hover:to-orange-100/40 hover:text-amber-900 hover:scale-[1.02] hover:shadow-md'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-3 w-full min-h-[3rem]">
                        <div className={`
                          p-2 rounded-lg transition-all duration-300 backdrop-blur-sm flex-shrink-0
                          ${isActive 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-white/60 group-hover:bg-white/80 shadow-sm'
                          }
                        `}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{item.title}</div>
                          <div className={`text-xs transition-colors truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-amber-600/80 group-hover:text-amber-700'}`}>
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1 h-6 bg-white/60 rounded-full shadow-sm flex-shrink-0"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-amber-200/40 bg-gradient-to-r from-amber-100/30 to-orange-100/20 backdrop-blur-sm">
        <Link to="/admin/profile">
          <button 
            onClick={handleUserClick}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/60 to-amber-50/80 hover:from-white/80 hover:to-amber-50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md border border-white/40 w-full"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 group-hover:text-amber-800 transition-colors truncate">{roleUtils.getUserDisplayRole()}</p>
              <p className="text-xs text-amber-700/80 truncate">Kinyarwanda Specialist</p>
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"></div>
          </button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
