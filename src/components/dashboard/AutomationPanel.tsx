'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateNotification } from '@/ai/flows/generate-notification';
import type { Student } from '@/lib/types';
import { BellRing, CheckCircle, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateRequiredLectures } from '@/lib/attendanceUtils';

interface AutomationPanelProps {
  studentsToNotify: Student[];
}

export function AutomationPanel({ studentsToNotify }: AutomationPanelProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedMessages, setProcessedMessages] = useState<string[]>([]);

  const handleRunAutomation = async () => {
    setIsProcessing(true);
    setProcessedMessages([]);

    toast({
      title: 'Automation Started',
      description: `Sending notifications to ${studentsToNotify.length} students...`,
    });

    const results: string[] = [];

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

        // This is a simulation. In a real app, you'd send an email/SMS here.
        console.log(`Simulating notification for ${student.name}: ${result.message}`);

        results.push(`✔️ Notification for ${student.name} prepared: "${result.message}"`);
      } catch (error) {
        console.error(`Failed to notify ${student.name}:`, error);
        results.push(`❌ Failed to prepare notification for ${student.name}.`);
      }
      setProcessedMessages([...results]);
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
          <AlertTriangle className="text-primary" />
          Notification Automation
        </CardTitle>
        <CardDescription>
          Automatically send alerts to all students in the 'Warning' or 'Critical' risk zones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          There are <strong>{studentsToNotify.length}</strong> students requiring a notification.
        </p>
        <Button onClick={handleRunAutomation} disabled={isProcessing || studentsToNotify.length === 0}>
          <BellRing className="mr-2 h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Run Automated Notifications'}
        </Button>
      </CardContent>
      {processedMessages.length > 0 && (
        <CardFooter className="flex-col items-start gap-2">
            <h4 className="font-semibold">Processing Log:</h4>
            <ScrollArea className="h-32 w-full rounded-md border p-2 bg-background">
                <div className="text-sm font-mono">
                    {processedMessages.map((msg, index) => (
                        <p key={index} className={msg.startsWith('❌') ? 'text-destructive' : ''}>{msg}</p>
                    ))}
                </div>
            </ScrollArea>
        </CardFooter>
      )}
    </Card>
  );
}
