import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { certificationService, Certificate } from '@/services/certificationService';

export function RecentCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await certificationService.getAllCertificates();
        const list = Array.isArray(data) ? data : [];
        // show latest 5
        const sorted = [...list].sort((a, b) => (a.issuedAt || '').localeCompare(b.issuedAt || ''));
        setItems(sorted.slice(-5).reverse());
      } catch (e) {
        console.error('Failed to load recent certificates', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900">Recent Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c, idx) => (
              <TableRow key={c.id ?? c.certificateId ?? idx}>
                <TableCell>{c.certificateId ?? c.id}</TableCell>
                <TableCell>{c.userEmail ?? c.userId}</TableCell>
                <TableCell>{c.courseName ?? c.courseId}</TableCell>
                <TableCell>{c.issuedAt ?? '-'}</TableCell>
              </TableRow>
            ))}
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-amber-700 text-center">No recent certificates</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
