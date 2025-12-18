import type { RiskLevel } from '@/lib/types';

const ATTENDANCE_THRESHOLD = 75;
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

/**
 * Calculates the number of lectures or days a student can miss or must attend.
 * For UI display in the "Prediction" column.
 */
export function calculatePrediction(attended: number, total: number): string {
  if (total === 0) return "N/A";
  
  const currentPercentage = (attended / total) * 100;
  if (currentPercentage < ATTENDANCE_THRESHOLD) {
    // Must attend N lectures consecutively to reach 75%
    const needed = Math.ceil(3 * total - 4 * attended);
    const days = Math.ceil(needed / LECTURES_PER_DAY);
    return `Must attend ${needed} lecture${needed !== 1 ? 's' : ''} (${days} day${days !== 1 ? 's' : ''})`;
  } else {
    // Can miss M lectures before dropping below 75%
    const missable = Math.floor((4 * attended - 3 * total) / 3);
    const days = Math.floor(missable / LECTURES_PER_DAY);
    if (missable > 0) {
      if (days > 0) {
        return `Can miss ${missable} lecture${missable !== 1 ? 's' : ''} (~${days} day${days !== 1 ? 's' : ''})`;
      }
      return `Can miss ${missable} lecture${missable !== 1 ? 's' : ''}`;
    }
    return "Cannot miss any lectures";
  }
}

/**
 * Generates a simplified number string of missable lectures for the AI prompt.
 */
export function getMissableLecturesForAI(attended: number, total: number): string {
    const missable = Math.floor((4 * attended - 3 * total) / 3);
    if (missable > 0) {
        return missable.toString();
    }
    return "0"; // They can't miss any. The AI must infer the "must attend" part from the risk level.
}
