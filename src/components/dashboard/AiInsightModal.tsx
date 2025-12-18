'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { BrainCircuit } from 'lucide-react';

interface AiInsightModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentName: string;
  advice: string;
}

export function AiInsightModal({ isOpen, onOpenChange, studentName, advice }: AiInsightModalProps) {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            AI Insight for {studentName}
          </DialogTitle>
          <DialogDescription asChild>
            <p className="pt-4 text-card-foreground/90 text-base leading-relaxed">
              {advice}
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
