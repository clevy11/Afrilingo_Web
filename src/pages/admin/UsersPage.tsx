
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, X, Globe, MessageSquare, Clock, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserStats } from '@/components/admin/users/UserStats';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { AdvancedSearchFilter } from '@/components/admin/shared/AdvancedSearchFilter';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { useEffect, useState } from 'react';
import { userService, BackendUserDto, UserProfile } from '@/services/userService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type TableUser = {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin' | string;
  backendRole: string;
  status: 'Active' | 'Inactive';
  country: string;
  firstLanguage: string;
  reasonToLearn: string;
  avatar: string;
  profile: UserProfile | null;
  profilePicture: string | null;
  dailyGoalMinutes: number | null;
  preferredLearningTime: string | null;
  dailyReminders: boolean | null;
};

function mapUser(u: BackendUserDto): TableUser {
  return {
    id: u.id,
    name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
    email: u.email,
    role: u.role === 'ROLE_ADMIN' ? 'Admin' : u.role === 'ROLE_PROCTOR' ? 'Instructor' : 'Student',
    backendRole: u.role,
    status: u.enabled ? 'Active' : 'Inactive',
    country: u.profile?.country ?? 'N/A',
    firstLanguage: u.profile?.firstLanguage ?? 'N/A',
    reasonToLearn: u.profile?.reasonToLearn ?? 'N/A',
    avatar: u.profile?.profilePicture || '👤',
    profile: u.profile,
    profilePicture: u.profile?.profilePicture ?? null,
    dailyGoalMinutes: u.profile?.dailyGoalMinutes ?? null,
    preferredLearningTime: u.profile?.preferredLearningTime ?? null,
    dailyReminders: u.profile?.dailyReminders ?? null,
  };
}

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<TableUser | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    enabled: true,
  });

  const {
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
  } = useSearchAndFilter();

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await userService.getAll();
        const mapped: TableUser[] = (data || []).map(mapUser);
        setUsers(mapped);
      } catch (e) {
        console.error('Failed to load users', e);
        toast({ title: 'Failed to load users', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [toast]);

  // Filter users based on search query, status filter, and role filter
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstLanguage.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status ||
      user.status.toLowerCase() === filters.status.toLowerCase();

    // Role filter (using backend role values)
    const matchesRole = roleFilter === 'all' || user.backendRole === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const filterOptions = {
    status: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
  };

  const handleUserAction = async (action: string, user: TableUser) => {
    if (action === 'View') {
      setSelectedUser(user);
      return;
    }
    if (action === 'Suspend') {
      const ok = window.confirm(`Delete user ${user.name}? This cannot be undone.`);
      if (!ok) return;
      try {
        await userService.delete(user.id);
        toast({ title: 'User deleted', description: `${user.name} was removed.` });
        await refreshUsers();
      } catch (e: unknown) {
        console.error('Failed to delete user', e);
        const message = (e as { message?: string })?.message ?? 'Unable to delete user';
        toast({ title: 'Delete failed', description: message });
      }
      return;
    }
    toast({
      title: `${action} User`,
      description: `${action} ${user.name}`,
    });
  };

  async function refreshUsers() {
    const data = await userService.getAll();
    const mapped: TableUser[] = (data || []).map(mapUser);
    setUsers(mapped);
  }

  async function handleCreateTutor(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.' });
      return;
    }
    try {
      setCreating(true);
      await userService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: 'ROLE_PROCTOR',
      });
      toast({ title: 'Tutor created', description: `${form.firstName} ${form.lastName} added as tutor.` });
      setShowCreate(false);
      setForm({ firstName: '', lastName: '', email: '', password: '', enabled: true });
      await refreshUsers();
    } catch (err: any) {
      console.error('Failed to create tutor', err);
      toast({ title: 'Creation failed', description: err?.message ?? 'Unable to create tutor' });
    } finally {
      setCreating(false);
    }
  }

  const handleClearAllFilters = () => {
    setRoleFilter('all');
    handleClearFilters();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-amber-900 dark:text-gray-100">User Management</h2>
            <p className="text-amber-700 dark:text-gray-400 mt-1">Manage Kinyarwanda learners and instructors</p>
          </div>
          <Button onClick={() => setShowCreate((v) => !v)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            {showCreate ? 'Close' : 'Add Tutor'}
          </Button>
        </div>

        {showCreate && (
          <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)]">
            <CardHeader>
              <CardTitle className="text-amber-900 dark:text-gray-100">Create Tutor</CardTitle>
              <CardDescription>New tutor accounts are created with role PROCTOR.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTutor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-amber-800 dark:text-gray-300">First Name</Label>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div>
                  <Label className="text-amber-800 dark:text-gray-300">Last Name</Label>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-amber-800 dark:text-gray-300">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-amber-800 dark:text-gray-300">Password</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="md:col-span-2 flex gap-3 items-center">
                  <input id="enabled" type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                  <Label htmlFor="enabled" className="text-amber-800 dark:text-gray-300">Enabled</Label>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={creating} className="bg-amber-600 hover:bg-amber-700 text-white">
                    {creating ? 'Creating...' : 'Create Tutor'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <UserStats users={users} />

        {/* Search + Role Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <AdvancedSearchFilter
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearch={handleSearch}
              placeholder="Search by name, email, role, country, or language..."
              filterOptions={filterOptions}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearAllFilters}
            />
          </div>
        </div>

        {/* Role Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-amber-800 dark:text-gray-300 mr-1">Filter by Role:</span>
          {[
            { value: 'all', label: 'All Roles', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/40' },
            { value: 'ROLE_ADMIN', label: 'Admin', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/40' },
            { value: 'ROLE_USER', label: 'Student', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/40' },
            { value: 'ROLE_PROCTOR', label: 'Proctor', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700/40' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRoleFilter(opt.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${roleFilter === opt.value
                ? `${opt.color} ring-2 ring-offset-1 ring-amber-400 shadow-sm`
                : 'bg-white dark:bg-white/5 text-amber-700 dark:text-gray-400 border-amber-200 dark:border-white/10 hover:bg-amber-50 dark:hover:bg-white/10'
                }`}
            >
              {opt.label}
              {opt.value !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({users.filter(u => u.backendRole === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <UsersTable users={filteredUsers} onUserAction={handleUserAction} />

        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-12">
            <div className="h-12 w-12 text-amber-400 mx-auto mb-4">👥</div>
            <h3 className="text-lg font-medium text-amber-900 dark:text-gray-200 mb-2">No users found</h3>
            <p className="text-amber-600 dark:text-gray-400 mb-6">Try adjusting your search terms or filters.</p>
            <Button
              onClick={handleClearAllFilters}
              variant="outline"
              className="border-amber-300 dark:border-white/10 text-amber-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-white/10"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* View Profile Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
            <div
              className="bg-white dark:bg-[hsl(220,14%,12%)] rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl p-6 text-white">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {selectedUser.profilePicture && selectedUser.profilePicture !== '👤' ? (
                      <img src={selectedUser.profilePicture} alt={selectedUser.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-white/80 text-sm">{selectedUser.email}</p>
                    <Badge className="mt-1 bg-white/20 text-white border-white/30 hover:bg-white/30">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Profile Details</h4>

                {selectedUser.profile ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
                      <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Country</p>
                        <p className="text-amber-900 dark:text-gray-100 font-medium">{selectedUser.country}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">First Language</p>
                        <p className="text-blue-900 dark:text-gray-100 font-medium">{selectedUser.firstLanguage}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20">
                      <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">Reason to Learn</p>
                        <p className="text-green-900 dark:text-gray-100 font-medium">{selectedUser.reasonToLearn}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Daily Goal</p>
                        <p className="text-purple-900 dark:text-gray-100 font-medium">
                          {selectedUser.dailyGoalMinutes != null ? `${selectedUser.dailyGoalMinutes} minutes` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Preferred Learning Time</p>
                        <p className="text-orange-900 dark:text-gray-100 font-medium">{selectedUser.preferredLearningTime ?? 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/20">
                      <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Daily Reminders</p>
                        <p className="text-teal-900 dark:text-gray-100 font-medium">{selectedUser.dailyReminders ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-amber-600 dark:text-gray-400">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="font-medium">No profile data available</p>
                    <p className="text-sm text-amber-500 dark:text-gray-500 mt-1">This user has not set up their profile yet.</p>
                  </div>
                )}

                <div className="pt-4 border-t border-amber-100 dark:border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-600 dark:text-gray-400">Status</span>
                    <Badge className={selectedUser.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
