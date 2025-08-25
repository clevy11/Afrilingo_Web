import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { certificationService, ProctorEvent } from '@/services/certificationService';

export function RecentProctorEvents() {
  const [items, setItems] = useState<ProctorEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await certificationService.getAllProctorEvents();
        const list = Array.isArray(data) ? data : [];
        // latest 5 by timestamp if present
        const sorted = [...list].sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
        setItems(sorted.slice(-5).reverse());
      } catch (e) {
        console.error('Failed to load recent proctor events', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900">Recent Proctor Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((ev, idx) => (
              <TableRow key={ev.id ?? idx}>
                <TableCell>{ev.eventTypeName || ev.eventType}</TableCell>
                <TableCell>{ev.userName || ev.userId || '-'}</TableCell>
                <TableCell>{ev.sessionId}</TableCell>
                <TableCell>{ev.timestamp ?? '-'}</TableCell>
              </TableRow>
            ))}
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-amber-700 text-center">No recent events</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
