
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Shield, Globe, MessageSquare } from 'lucide-react';
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
  country: string;
  firstLanguage: string;
  reasonToLearn: string;
  avatar: string;
  profilePicture?: string | null;
}

interface UsersTableProps {
  users: User[];
  onUserAction: (action: string, user: User) => void;
}

export function UsersTable({ users, onUserAction }: UsersTableProps) {
  const getRoleBadge = (role: string) => {
    const roleColors = {
      Student: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Instructor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Moderator: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
        <CardTitle className="text-amber-900 dark:text-gray-100">All Users ({users.length})</CardTitle>
        <CardDescription>Manage your Kinyarwanda learning community</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>First Language</TableHead>
              <TableHead className="max-w-[200px]">Reason to Learn</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden shrink-0">
                      {user.profilePicture && user.profilePicture !== '👤' ? (
                        <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover rounded-full" />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-amber-900 dark:text-gray-100">{user.name}</div>
                      <div className="text-sm text-amber-600 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1.5">
                    <Globe className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                    <span className="text-sm text-amber-800 dark:text-gray-300">{user.country}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-sm text-amber-800 dark:text-gray-300">{user.firstLanguage}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <span className="text-sm text-amber-700 dark:text-gray-400 line-clamp-2" title={user.reasonToLearn}>
                    {user.reasonToLearn}
                  </span>
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
