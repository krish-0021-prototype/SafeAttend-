'use client';

import { useState, useEffect } from 'react';
import type { Student } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AttendanceProgressBar } from './AttendanceProgressBar';
import { Badge } from '@/components/ui/badge';
import { calculateRequiredLectures, calculateSkippableLectures } from '@/lib/attendanceUtils';
import { getPersonalizedAttendanceAdvice, type PersonalizedAttendanceAdviceOutput } from '@/ai/flows/personalized-attendance-advice';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentDetailsDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, open, onOpenChange }: StudentDetailsDialogProps) {
  const [aiAdvice, setAiAdvice] = useState<PersonalizedAttendanceAdviceOutput | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  useEffect(() => {
    if (student && open) {
      setIsLoadingAdvice(true);
      setAiAdvice(null);
      getPersonalizedAttendanceAdvice({
        name: student.name,
        overallAttendance: student.overallAttendance,
        riskLevel: student.riskLevel,
      })
      .then(setAiAdvice)
      .catch(console.error)
      .finally(() => setIsLoadingAdvice(false));
    }
  }, [student, open]);

  if (!student) return null;

  const { attendedLectures, totalLectures } = student.subjects[0] || { attendedLectures: 0, totalLectures: 0 };
  const requiredLectures = calculateRequiredLectures(attendedLectures, totalLectures);
  const skippableLectures = calculateSkippableLectures(attendedLectures, totalLectures);

  const getRiskBadgeVariant = (riskLevel: Student['riskLevel']) => {
    switch (riskLevel) {
      case 'Safe': return 'default';
      case 'Warning': return 'secondary';
      case 'Critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
          <DialogDescription>
            {student.branch} - Year {student.year}, Div {student.division}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <AttendanceProgressBar percentage={student.overallAttendance} riskLevel={student.riskLevel} />
            </div>
            <span className="text-xl font-bold w-20 text-right">{student.overallAttendance.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Risk Level:</span>
            <Badge variant={getRiskBadgeVariant(student.riskLevel)} className={cn({'bg-accent text-accent-foreground hover:bg-accent/80': student.riskLevel === 'Safe', 'bg-primary text-primary-foreground hover:bg-primary/80': student.riskLevel === 'Warning'})}>
                {student.riskLevel}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted">
            {student.riskLevel === 'Critical' ? (
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-destructive/20 text-destructive rounded-full"><TrendingUp className="h-5 w-5"/></div>
                <div>
                  <p className="font-semibold">Lectures to Attend</p>
                  <p className="text-sm text-muted-foreground">
                    Must attend the next <strong className="text-foreground">{requiredLectures}</strong> lectures to reach the 70% safe zone.
                  </p>
                </div>
              </div>
            ) : (
                 <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-accent/80 text-accent-foreground rounded-full"><TrendingDown className="h-5 w-5"/></div>
                    <div>
                        <p className="font-semibold">Skippable Lectures</p>
                        <p className="text-sm text-muted-foreground">
                            Can miss <strong className="text-foreground">{skippableLectures}</strong> more lectures before dropping below 70%.
                        </p>
                    </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg border">
             <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary/20 text-primary rounded-full"><Sparkles className="h-5 w-5"/></div>
                <div>
                    <p className="font-semibold">Personalized AI Advice</p>
                    {isLoadingAdvice ? (
                        <div className="space-y-1 mt-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    ) : aiAdvice ? (
                        <p className="text-sm text-muted-foreground italic">"{aiAdvice.aiAdvice}"</p>
                    ) : (
                        <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Could not load AI advice.</p>
                    )}
                </div>
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
