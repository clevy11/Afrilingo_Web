
import React from 'react';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormLayoutProps {
  title: string;
  description: string;
  backUrl: string;
  children: React.ReactNode;
}

export function FormLayout({ title, description, backUrl, children }: FormLayoutProps) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={backUrl}>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">{title}</h1>
            <p className="text-amber-700">{description}</p>
          </div>
        </div>
        
        <Card className="border-amber-200 max-w-4xl">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
