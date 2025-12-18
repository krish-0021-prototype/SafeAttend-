'use client';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/lib/types';

interface AttendanceProgressBarProps {
  percentage: number;
  riskLevel: RiskLevel;
}

export function AttendanceProgressBar({ percentage, riskLevel }: AttendanceProgressBarProps) {
  const colorClass = {
    Safe: 'bg-accent', // Mapped to Teal
    Warning: 'bg-primary', // Mapped to Indigo
    Critical: 'bg-destructive', // Mapped to Red
  }[riskLevel];

  return (
    <div className="w-full bg-muted rounded-full h-2.5" title={`${percentage.toFixed(1)}%`}>
      <div
        className={cn('h-2.5 rounded-full transition-all duration-500', colorClass)}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
