
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Shield, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  coursesEnrolled: number;
  completionRate: number;
  avatar: string;
}

interface UsersTableProps {
  users: User[];
  onUserAction: (action: string, user: User) => void;
}

export function UsersTable({ users, onUserAction }: UsersTableProps) {
  const getRoleBadge = (role: string) => {
    const roleColors = {
      Student: "bg-blue-100 text-blue-800",
      Instructor: "bg-purple-100 text-purple-800", 
      Moderator: "bg-orange-100 text-orange-800",
      Admin: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={`${roleColors[role as keyof typeof roleColors]} hover:${roleColors[role as keyof typeof roleColors]}`}>
        {role}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-900">All Users ({users.length})</CardTitle>
        <CardDescription>Manage your Kinyarwanda learning community</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <div className="font-medium text-amber-900">{user.name}</div>
                      <div className="text-sm text-amber-600">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{user.coursesEnrolled}</span>
                    <span className="text-amber-600 text-sm">courses</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-amber-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${user.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{user.completionRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-amber-700">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">{user.joinDate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onUserAction('View', user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUserAction('Edit', user)}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUserAction('Email', user)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'Inactive' ? (
                        <DropdownMenuItem 
                          onClick={() => onUserAction('Activate', user)}
                          className="text-green-700"
                        >
                          Activate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => onUserAction('Suspend', user)}
                          className="text-red-600"
                        >
                          Suspend User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
