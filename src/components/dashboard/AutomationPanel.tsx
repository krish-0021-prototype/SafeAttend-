'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateNotification } from '@/ai/flows/generate-notification';
import type { Student } from '@/lib/types';
import { BellRing, CheckCircle, AlertTriangle, Mail, Loader2, MessageSquareText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateRequiredLectures } from '@/lib/attendanceUtils';
import { sendEmail } from '@/app/actions';

interface AutomationPanelProps {
  studentsToNotify: Student[];
}

interface ProcessedResult {
  name: string;
  email: string;
  message: string;
  status: 'success' | 'failure';
  error?: string;
}

export function AutomationPanel({ studentsToNotify }: AutomationPanelProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);

  const handleRunAutomation = async () => {
    setIsProcessing(true);
    setProcessedResults([]);

    toast({
      title: 'Automation Started',
      description: `Processing notifications for ${studentsToNotify.length} students...`,
    });

    const results: ProcessedResult[] = [];

    for (const student of studentsToNotify) {
      try {
        const { attendedLectures, totalLectures } = student.subjects[0] || { attendedLectures: 0, totalLectures: 0 };
        const requiredLectures = calculateRequiredLectures(attendedLectures, totalLectures);
        
        const result = await generateNotification({
          name: student.name,
          overallAttendance: student.overallAttendance,
          riskLevel: student.riskLevel,
          requiredLectures,
        });
        
        const emailResult = await sendEmail({
          to: student.email,
          subject: `Attendance Alert: ${student.riskLevel}`,
          body: result.message,
        });

        const newResult: ProcessedResult = {
          name: student.name,
          email: student.email,
          message: result.message,
          status: emailResult.success ? 'success' : 'failure',
          error: emailResult.success ? undefined : emailResult.message,
        };
        results.push(newResult);

      } catch (error) {
        console.error(`Failed to process notification for ${student.name}:`, error);
        const newResult: ProcessedResult = {
          name: student.name,
          email: student.email,
          message: 'Failed to generate AI message.',
          status: 'failure',
          error: error instanceof Error ? error.message : 'An unknown error occurred.',
        };
        results.push(newResult);
      }
      setProcessedResults([...results]);
    }

    toast({
      title: 'Automation Complete',
      description: 'All notifications have been processed.',
      action: <CheckCircle className="text-green-500" />,
    });
    setIsProcessing(false);
  };

  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="text-primary" />
          Email Notification Automation
        </CardTitle>
        <CardDescription>
          Automatically send email alerts to all students in the 'Warning' or 'Critical' risk zones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          There are <strong>{studentsToNotify.length}</strong> students requiring a notification.
        </p>
        <Button onClick={handleRunAutomation} disabled={isProcessing || studentsToNotify.length === 0}>
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BellRing className="mr-2 h-4 w-4" />
          )}
          {isProcessing ? 'Processing...' : 'Run Automated Notifications'}
        </Button>
      </CardContent>
      {processedResults.length > 0 && (
        <CardFooter className="flex-col items-start gap-2">
            <h4 className="font-semibold">Processing Log:</h4>
            <ScrollArea className="h-48 w-full rounded-md border p-2 bg-background">
                <div className="space-y-4">
                    {processedResults.map((res, index) => (
                        <div key={index} className="text-sm font-mono p-2 border-b last:border-b-0">
                          <p className="font-semibold">To: {res.name} ({res.email})</p>
                          <div className="flex items-start gap-2 mt-1">
                            <MessageSquareText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"/>
                            <p className="italic text-muted-foreground">"{res.message}"</p>
                          </div>
                          {res.status === 'success' ? (
                            <p className="text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Email sent successfully.</p>
                          ) : (
                            <p className="text-destructive mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Failed: {res.error}</p>
                          )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </CardFooter>
      )}
    </Card>
  );
}
