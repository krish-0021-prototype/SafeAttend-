import type { RiskLevel } from '@/lib/types';

const ATTENDANCE_THRESHOLD = 70;
const SAFE_THRESHOLD = 80;
const LECTURES_PER_DAY = 5;

export function calculateRiskLevel(attendance: number): RiskLevel {
  if (attendance < ATTENDANCE_THRESHOLD) {
    return "Critical";
  }
  if (attendance < SAFE_THRESHOLD) {
    return "Warning";
  }
  return "Safe";
}

export function calculateRequiredLectures(attended: number, total: number): number {
  if (total === 0) return 0;
  
  const currentPercentage = (attended / total) * 100;
  const threshold = ATTENDANCE_THRESHOLD / 100; // 0.7

  if (currentPercentage < ATTENDANCE_THRESHOLD) {
    // Must attend N lectures to reach the threshold
    // (attended + N) / (total + N) >= threshold
    const needed = Math.ceil((threshold * total - attended) / (1 - threshold));
    return needed > 0 ? needed : 0;
  }
  return 0; // Not in a critical state, no required lectures to show.
}


export function calculatePrediction(attended: number, total: number): number {
    if (total === 0) return 0;
    const currentPercentage = (attended / total) * 100;
    const threshold = ATTENDANCE_THRESHOLD / 100; // 0.7
  
    if (currentPercentage < ATTENDANCE_THRESHOLD) {
      return 0; // Can't miss any more lectures
    }
    
    // How many lectures (N) can be missed?
    // attended / (total + N) >= threshold
    const missable = Math.floor((attended / threshold) - total);
    return missable > 0 ? missable : 0;
}
