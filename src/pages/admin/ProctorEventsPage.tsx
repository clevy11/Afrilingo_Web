import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { certificationService, ProctorEvent } from '@/services/certificationService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// All known Proctor Event Types from the backend enum
const PROCTOR_EVENT_TYPES = [
  'FACE_NOT_DETECTED',
  'MULTIPLE_FACES_DETECTED',
  'EXTENDED_LOOK_AWAY',
  'PROHIBITED_OBJECT_DETECTED',
  'SUSPICIOUS_MOVEMENT',
  'AUDIO_ANOMALY',
  'BROWSER_TAB_CHANGE',
  'COPY_PASTE_ATTEMPT',
  'SCREENSHOT_ATTEMPT',
  'SESSION_START',
  'SESSION_END',
  'WARNING_ISSUED',
  'SESSION_TERMINATED',
  'INACTIVITY_DETECTED',
  'APP_FOCUS_LOST',
] as const;

function formatEventType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function getEventBadgeColor(type: string): string {
  if (type.includes('SESSION_START')) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30';
  if (type.includes('SESSION_END')) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30';
  if (type.includes('SESSION_TERMINATED')) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30';
  if (type.includes('WARNING')) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30';
  if (type.includes('FACE') || type.includes('MULTIPLE')) return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/30';
  if (type.includes('SUSPICIOUS') || type.includes('PROHIBITED')) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30';
  return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
}

const ProctorEventsPage: React.FC = () => {
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

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

  // Derive distinct event types present in the fetched data for the dropdown
  const availableEventTypes = useMemo(() => {
    const typesInData = new Set(
      events.map(ev => ev.eventType).filter(Boolean)
    );
    // Show all backend types, but mark which ones are present in data
    return PROCTOR_EVENT_TYPES.filter(t => typesInData.has(t));
  }, [events]);

  // Client-side filtering — no additional API calls
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      // Search filter: match against ID, session, user, type, description
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        String(ev.id).includes(q) ||
        String(ev.sessionId).includes(q) ||
        (ev.userName || '').toLowerCase().includes(q) ||
        String(ev.userId || '').includes(q) ||
        (ev.eventType || '').toLowerCase().includes(q) ||
        (ev.eventTypeName || '').toLowerCase().includes(q) ||
        (ev.description || '').toLowerCase().includes(q) ||
        (ev.timestamp || '').toLowerCase().includes(q);

      // Event type filter
      const matchesType = eventTypeFilter === 'all' || ev.eventType === eventTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, eventTypeFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setEventTypeFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || eventTypeFilter !== 'all';

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)]">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-gray-100">All Proctor Events</CardTitle>
            <CardDescription className="dark:text-gray-400">Monitoring events across all users and sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Input
                  placeholder="Search by ID, session, user, type, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-amber-300 dark:border-white/10 dark:bg-white/5 focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Event Type Filter */}
              <div className="sm:w-64">
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger className="border-amber-300 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <SelectValue placeholder="Filter by event type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-amber-200 dark:border-white/10 z-50 max-h-[300px]">
                    <SelectItem value="all">All Event Types</SelectItem>
                    {availableEventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEventType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-red-300 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-gray-400">
                <span>Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events</span>
                {eventTypeFilter !== 'all' && (
                  <Badge className={`${getEventBadgeColor(eventTypeFilter)} text-xs`}>
                    {formatEventType(eventTypeFilter)}
                  </Badge>
                )}
              </div>
            )}

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
                {filteredEvents.map((ev, idx) => (
                  <TableRow key={ev.id ?? idx}>
                    <TableCell>{ev.id}</TableCell>
                    <TableCell>{ev.sessionId}</TableCell>
                    <TableCell>{ev.userName || ev.userId || '-'}</TableCell>
                    <TableCell>
                      <Badge className={`${getEventBadgeColor(ev.eventType)} text-xs`}>
                        {ev.eventTypeName || formatEventType(ev.eventType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate" title={ev.description}>{ev.description ?? '-'}</TableCell>
                    <TableCell>
                      {ev.confidenceScore != null ? (
                        <span className={`font-medium ${ev.confidenceScore >= 0.8 ? 'text-red-600 dark:text-red-400' :
                          ev.confidenceScore >= 0.5 ? 'text-orange-600 dark:text-orange-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                          {(ev.confidenceScore * 100).toFixed(0)}%
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{ev.timestamp ?? '-'}</TableCell>
                  </TableRow>
                ))}
                {(!loading && filteredEvents.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-amber-700 dark:text-gray-400">
                        <div className="text-3xl mb-2">🔍</div>
                        {events.length === 0 ? (
                          <p>No events found</p>
                        ) : (
                          <>
                            <p className="font-medium">No events match your filters</p>
                            <p className="text-sm text-amber-500 dark:text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-amber-600 dark:text-amber-400">
                      Loading events...
                    </TableCell>
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
