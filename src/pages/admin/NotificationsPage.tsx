
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, User, BookOpen, Trophy, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<any>;
}

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Course Enrollment",
      message: "245 students enrolled in Swahili Basics course today",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
      icon: BookOpen
    },
    {
      id: 2,
      title: "Challenge Completed",
      message: "Yoruba Pronunciation challenge has been completed by 89 students",
      type: "info",
      timestamp: "4 hours ago",
      read: false,
      icon: Trophy
    },
    {
      id: 3,
      title: "System Update",
      message: "Platform maintenance scheduled for tonight at 11 PM",
      type: "warning",
      timestamp: "1 day ago",
      read: true,
      icon: Settings
    },
    {
      id: 4,
      title: "New User Registration",
      message: "127 new users registered this week",
      type: "info",
      timestamp: "2 days ago",
      read: true,
      icon: User
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
      variant: "destructive",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-amber-800" />
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Notifications</h1>
              <p className="text-amber-700">Stay updated with platform activities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              {unreadCount} unread
            </Badge>
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-amber-900 mb-2">No notifications</h3>
                <p className="text-amber-700">You're all caught up! No new notifications to display.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${!notification.read ? 'ring-2 ring-amber-200 bg-amber-50/50' : ''} hover:shadow-lg transition-all duration-200`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900 mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full ml-2"></span>
                            )}
                          </h3>
                          <p className="text-amber-700 text-sm mb-2">{notification.message}</p>
                          <p className="text-amber-600 text-xs">{notification.timestamp}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                            className="border-red-300 text-red-700 hover:bg-red-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
