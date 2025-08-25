import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '@/services/profileService';

export function UserProfile() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUser] = useState({
    firstname: 'Not available',
    lastname: 'Not available',
    email: 'Not available',
  });

  useEffect(() => {
    async function load() {
      try {
        const name = await profileService.getName();
        setUser((prev) => ({
          ...prev,
          firstname: name.firstName ?? prev.firstname,
          lastname: name.lastName ?? prev.lastname,
          email: name.email ?? prev.email,
        }));
      } catch (e) {
        console.error('Failed to load profile name', e);
      }
    }
    load();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <User className="h-6 w-6" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-amber-900">{userData.firstname} {userData.lastname}</div>
          
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-amber-600" />
          <span className="text-amber-700">{userData.email}</span>
        </div>
      </CardContent>
    </Card>
  );
}
