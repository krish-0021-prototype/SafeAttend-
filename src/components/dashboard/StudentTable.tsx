'use client';

import type { Student } from '@/lib/types';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AttendanceProgressBar } from './AttendanceProgressBar';
import { cn } from '@/lib/utils';
import { Info, BellRing, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateNotification } from '@/ai/flows/generate-notification';
import { calculateRequiredLectures } from '@/lib/attendanceUtils';

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const { toast } = useToast();
  const [notifying, setNotifying] = useState<string | null>(null);

  const handleNotify = async (student: Student) => {
    if (student.riskLevel !== 'Critical' && student.riskLevel !== 'Warning') {
        toast({
            variant: 'default',
            title: 'Not Required',
            description: `${student.name} is in the Safe zone.`,
        });
        return;
    }

    setNotifying(student.id);
    try {
      const { attendedLectures, totalLectures } = student.subjects[0] || { attendedLectures: 0, totalLectures: 0 };
      const requiredLectures = calculateRequiredLectures(attendedLectures, totalLectures);
      const notification = await generateNotification({
        name: student.name,
        overallAttendance: student.overallAttendance,
        riskLevel: student.riskLevel,
        requiredLectures,
      });

      // DEVELOPER TODO:
      // This is where you would call your email API for a single student.
      // You have access to the student's email and the generated message.
      // Example:
      // await sendEmail({
      //   to: student.email,
      //   subject: `Attendance Alert: ${student.riskLevel}`,
      //   body: notification.message,
      // });
      // console.log(`Simulating email to ${student.email}: ${notification.message}`);

      toast({
        title: 'Notification Sent',
        description: `An alert has been sent to ${student.name}.`,
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send notification. Please try again.',
      });
    } finally {
      setNotifying(null);
    }
  };

  const getRiskBadgeVariant = (riskLevel: Student['riskLevel']) => {
    switch (riskLevel) {
      case 'Safe':
        return 'default';
      case 'Warning':
        return 'secondary';
      case 'Critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] font-semibold">Student Name</TableHead>
              <TableHead className="font-semibold">Year</TableHead>
              <TableHead className="font-semibold">Branch</TableHead>
              <TableHead className="font-semibold">Division</TableHead>
              <TableHead className="font-semibold">Overall Attendance</TableHead>
              <TableHead className="font-semibold">Risk Level</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.division}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <AttendanceProgressBar
                          percentage={student.overallAttendance}
                          riskLevel={student.riskLevel}
                        />
                      </div>
                      <span className="text-sm font-semibold w-16 text-right text-muted-foreground">
                        {student.overallAttendance.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(student.riskLevel)} 
                           className={cn({'bg-accent text-accent-foreground hover:bg-accent/80': student.riskLevel === 'Safe', 'bg-primary text-primary-foreground hover:bg-primary/80': student.riskLevel === 'Warning'})}>
                      {student.riskLevel === 'Warning' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {student.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(student.riskLevel === 'Critical' || student.riskLevel === 'Warning') && (
                       <Button 
                         variant="ghost" 
                         size="icon"
                         onClick={() => handleNotify(student)}
                         disabled={notifying === student.id}
                         aria-label={`Notify ${student.name}`}
                       >
                         <BellRing className="h-4 w-4" />
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Info className="h-8 w-8" />
                    <p>No students found for the selected filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
