import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileDown, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reportService, type ReportType, type DateRange, type ReportFilters } from '@/services/reportService';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';
import { certificationService } from '@/services/certificationService';

export function ReportGenerator() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>('user-registration');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [availableReports, setAvailableReports] = useState<ReportType[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const allReportTypes: { value: ReportType; label: string }[] = [
    { value: 'user-registration', label: 'User Registration Report' },
    { value: 'active-users', label: 'All Users Report' },
    { value: 'course-enrollment', label: 'Course Enrollment Report' },
    { value: 'course-completion', label: 'Course Completion Report' },
    { value: 'certification-performance', label: 'Certification Performance Report' }
  ];

  useEffect(() => {
    async function checkAvailableReports() {
      try {
        setLoadingReports(true);
        const available: ReportType[] = [];

        // Check if users exist
        try {
          const users = await userService.getAll();
          if (Array.isArray(users) && users.length > 0) {
            available.push('user-registration');
            available.push('active-users');
          }
        } catch (e) {
          console.error('Users check failed:', e);
        }

        // Check if courses exist
        try {
          const courses = await courseService.getAll();
          if (Array.isArray(courses) && courses.length > 0) {
            available.push('course-enrollment');
            available.push('course-completion');
          }
        } catch (e) {
          console.error('Courses check failed:', e);
        }

        // Check if certificates exist
        try {
          const certificates = await certificationService.getAllCertificates();
          if (Array.isArray(certificates) && certificates.length > 0) {
            available.push('certification-performance');
          }
        } catch (e) {
          console.error('Certificates check failed:', e);
        }

        // System activity is always available
        available.push('system-activity');

        setAvailableReports(available);
        
        // Set default report type to first available if current one is not available
        if (available.length > 0) {
          const currentAvailable = available.includes(reportType);
          if (!currentAvailable) {
            setReportType(available[0]);
          }
        }
      } catch (error) {
        console.error('Failed to check available reports:', error);
        // Fallback to all reports if check fails
        setAvailableReports(allReportTypes.map(r => r.value));
      } finally {
        setLoadingReports(false);
      }
    }
    checkAvailableReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      
      const filters: ReportFilters = {
        dateRange,
        ...(dateRange === 'custom' && { startDate, endDate }),
      };

      const reportData = await reportService.generateReport(reportType, filters);
      
      const filename = `${reportType}-${new Date().toISOString().split('T')[0]}`;
      reportService.exportToCSV(reportData, filename);
      
      toast({
        title: 'Report Generated',
        description: `Report downloaded successfully as ${filename}.csv`,
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-[hsl(220,12%,18%)]">
      <CardHeader>
        <CardTitle className="text-amber-900 dark:text-gray-100 flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Generate Reports
        </CardTitle>
        <CardDescription>
          Export system data and analytics in CSV format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          {loadingReports ? (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking available reports...
            </div>
          ) : (
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allReportTypes
                  .filter(type => availableReports.includes(type.value))
                  .map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          {availableReports.length === 0 && !loadingReports && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              No reports available. Please ensure data exists in the system.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger id="date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={generating || loadingReports || availableReports.length === 0 || (dateRange === 'custom' && (!startDate || !endDate))}
          className="w-full bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
