import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { certificationService, Certificate } from '@/services/certificationService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await certificationService.getAllCertificates();
        setCerts(data || []);
      } catch (e) {
        console.error('Failed to load certificates', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">All Certificates</CardTitle>
            <CardDescription>All issued certificates across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Issued At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map((c, idx) => (
                  <TableRow key={c.id ?? c.certificateId ?? idx}>
                    <TableCell>{c.certificateId ?? c.id}</TableCell>
                    <TableCell>{c.userEmail ?? c.userId}</TableCell>
                    <TableCell>{c.courseName ?? c.courseId}</TableCell>
                    <TableCell>{c.issuedAt ?? '-'}</TableCell>
                  </TableRow>
                ))}
                {(!loading && certs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-amber-700">No certificates yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CertificatesPage;
