'use client';

import type { Student } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AttendanceProgressBar } from './AttendanceProgressBar';
import { cn } from '@/lib/utils';

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
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
              <TableHead className="w-[200px] font-semibold">Student Name</TableHead>
              <TableHead className="font-semibold">Overall Attendance</TableHead>
              <TableHead className="font-semibold">Risk Level</TableHead>
              <TableHead className="font-semibold">Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                <TableCell className="font-medium">{student.name}</TableCell>
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
                    {student.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>{student.missableLectures}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
