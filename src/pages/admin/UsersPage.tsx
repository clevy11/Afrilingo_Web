
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';
import { UserStats } from '@/components/admin/users/UserStats';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { AdvancedSearchFilter } from '@/components/admin/shared/AdvancedSearchFilter';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { useEffect, useState } from 'react';
import { userService, BackendUserDto } from '@/services/userService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TableUser = {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin' | string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  coursesEnrolled: number;
  completionRate: number;
  avatar: string;
};

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
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
        const mapped: TableUser[] = (data || []).map((u: BackendUserDto) => ({
          id: u.id,
          name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
          email: u.email,
          role: u.role === 'ROLE_ADMIN' ? 'Admin' : u.role === 'ROLE_PROCTOR' ? 'Instructor' : 'Student',
          status: u.enabled ? 'Active' : 'Inactive',
          joinDate: '-',
          coursesEnrolled: 0,
          completionRate: 0,
          avatar: '👤',
        }));
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

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status ||
      user.status.toLowerCase() === filters.status.toLowerCase();

    // Role filter
    const matchesRole = !filters.category ||
      user.role.toLowerCase() === filters.category.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  const filterOptions = {
    status: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    category: [
      { value: 'student', label: 'Student' },
      { value: 'instructor', label: 'Instructor' },
      { value: 'admin', label: 'Admin' }
    ]
  };

  const handleUserAction = async (action: string, user: TableUser) => {
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
    const mapped: TableUser[] = (data || []).map((u: BackendUserDto) => ({
      id: u.id,
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
      email: u.email,
      role: u.role === 'ROLE_ADMIN' ? 'Admin' : u.role === 'ROLE_PROCTOR' ? 'Instructor' : 'Student',
      status: u.enabled ? 'Active' : 'Inactive',
      joinDate: '-',
      coursesEnrolled: 0,
      completionRate: 0,
      avatar: '👤',
    }));
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
    } catch (err) {
      console.error('Failed to create tutor', err);
      toast({ title: 'Creation failed', description: err?.message ?? 'Unable to create tutor' });
    } finally {
      setCreating(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-amber-900">User Management</h2>
            <p className="text-amber-700 mt-1">Manage Kinyarwanda learners and instructors</p>
          </div>
          <Button onClick={() => setShowCreate((v) => !v)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            {showCreate ? 'Close' : 'Add Tutor'}
          </Button>
        </div>

        {showCreate && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Create Tutor</CardTitle>
              <CardDescription>New tutor accounts are created with role PROCTOR.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTutor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-amber-800">First Name</Label>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div>
                  <Label className="text-amber-800">Last Name</Label>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-amber-800">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-amber-800">Password</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="md:col-span-2 flex gap-3 items-center">
                  <input id="enabled" type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                  <Label htmlFor="enabled" className="text-amber-800">Enabled</Label>
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

        <AdvancedSearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search by name, email, or role..."
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <UsersTable users={filteredUsers} onUserAction={handleUserAction} />

        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-12">
            <div className="h-12 w-12 text-amber-400 mx-auto mb-4">👥</div>
            <h3 className="text-lg font-medium text-amber-900 mb-2">No users found</h3>
            <p className="text-amber-600 mb-6">Try adjusting your search terms or filters.</p>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
