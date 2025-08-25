import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { certificationService, ProctorEvent } from '@/services/certificationService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ProctorEventsPage: React.FC = () => {
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await certificationService.getAllProctorEvents();
        setEvents(data || []);
      } catch (e) {
        console.error('Failed to load proctor events', e);
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
            <CardTitle className="text-amber-900">All Proctor Events</CardTitle>
            <CardDescription>Monitoring events across all users and sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev, idx) => (
                  <TableRow key={ev.id ?? idx}>
                    <TableCell>{ev.id}</TableCell>
                    <TableCell>{ev.sessionId}</TableCell>
                    <TableCell>{ev.userName || ev.userId || '-'}</TableCell>
                    <TableCell>{ev.eventTypeName || ev.eventType}</TableCell>
                    <TableCell className="max-w-[400px] truncate" title={ev.description}>{ev.description ?? '-'}</TableCell>
                    <TableCell>{ev.confidenceScore ?? '-'}</TableCell>
                    <TableCell>{ev.timestamp ?? '-'}</TableCell>
                  </TableRow>
                ))}
                {(!loading && events.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-amber-700">No events found</TableCell>
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

export default ProctorEventsPage;
