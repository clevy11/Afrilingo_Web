
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Palette, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminService, type AdminSettings } from '@/services/adminService';
import { profileService } from '@/services/profileService';
import { useTheme } from '@/components/ThemeProvider';

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme: currentTheme, setTheme: setThemeFromProvider } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [settings, setSettings] = useState<AdminSettings>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
    },
    notifications: {
      email: true,
      push: false,
      weekly: true,
      marketing: false,
    },
    security: {
      twoFactorEnabled: false,
    },
    appearance: {
      theme: 'system',
      dashboardLayout: 'default',
    },
    general: {
      language: 'en',
      timezone: 'africa/kigali',
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const loadedSettings = await adminService.getSettings();
        
        // Load from localStorage for client-side preferences
        const storedNotifications = localStorage.getItem('admin_notification_preferences');
        const storedSecurity = localStorage.getItem('admin_security_settings');
        const storedAppearance = localStorage.getItem('admin_appearance_settings');
        const storedGeneral = localStorage.getItem('admin_general_settings');
        
        // Sync theme from ThemeProvider
        const themeFromProvider = currentTheme || 'system';
        
        setSettings({
          ...loadedSettings,
          appearance: {
            ...loadedSettings.appearance,
            theme: themeFromProvider as 'light' | 'dark' | 'system',
          },
          notifications: storedNotifications ? { ...loadedSettings.notifications, ...JSON.parse(storedNotifications) } : loadedSettings.notifications,
          security: storedSecurity ? { ...loadedSettings.security, ...JSON.parse(storedSecurity) } : loadedSettings.security,
          general: storedGeneral ? { ...loadedSettings.general, ...JSON.parse(storedGeneral) } : loadedSettings.general,
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [toast, currentTheme]);

  const handleSave = async (section: string) => {
    try {
      setSaving(section);
      
      switch (section) {
        case 'Profile':
          await adminService.updateProfile(settings.profile);
          break;
        case 'Notification':
          await adminService.updateNotifications(settings.notifications);
          break;
        case 'Security':
          await adminService.updateSecurity(settings.security);
          break;
        case 'Appearance':
          await adminService.updateAppearance(settings.appearance);
          // Update theme using ThemeProvider
          if (settings.appearance.theme) {
            setThemeFromProvider(settings.appearance.theme);
          }
          break;
        case 'General':
          await adminService.updateGeneral(settings.general);
          break;
      }
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      console.error(`Failed to save ${section} settings:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${section} settings. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <p className="text-amber-600 dark:text-amber-400">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-amber-800 dark:text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-900 dark:text-gray-100">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={settings.profile.firstName}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, firstName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={settings.profile.lastName}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, lastName: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={settings.profile.phone || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    placeholder="Tell us about yourself..."
                    value={settings.profile.bio || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, bio: e.target.value }
                    })}
                  />
                </div>
                <Button 
                  onClick={() => handleSave('Profile')} 
                  disabled={saving === 'Profile'}
                  className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                >
                  {saving === 'Profile' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about platform activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Get weekly platform activity summary</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weekly}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weekly: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, marketing: checked }
                    })}
                  />
                </div>
                <Button 
                  onClick={() => handleSave('Notification')} 
                  disabled={saving === 'Notification'}
                  className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                >
                  {saving === 'Notification' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorEnabled: checked }
                    })}
                  />
                </div>
                <Button 
                  onClick={() => handleSave('Security')} 
                  disabled={saving === 'Security'}
                  className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                >
                  {saving === 'Security' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update Security'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => {
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: value }
                      });
                      // Immediately update theme via ThemeProvider
                      setThemeFromProvider(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select 
                    value={settings.appearance.dashboardLayout}
                    onValueChange={(value: 'default' | 'compact' | 'expanded') => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, dashboardLayout: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleSave('Appearance')} 
                  disabled={saving === 'Appearance'}
                  className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                >
                  {saving === 'Appearance' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Appearance'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general platform preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="rw">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa/kigali">Africa/Kigali</SelectItem>
                      <SelectItem value="africa/nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="africa/lagos">Africa/Lagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => handleSave('General')} 
                  disabled={saving === 'General'}
                  className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                >
                  {saving === 'General' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
