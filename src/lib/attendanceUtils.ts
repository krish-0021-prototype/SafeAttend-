import type { RiskLevel } from '@/lib/types';

const ATTENDANCE_THRESHOLD = 70;
const SAFE_THRESHOLD = 75;
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
 * Calculates how many consecutive lectures a student must attend to reach the 70% threshold.
 * Only applies to students currently below 70%.
 * @param attended - Number of lectures attended.
 * @param total - Total lectures so far.
 * @returns The number of lectures required.
 */
export function calculateRequiredLectures(attended: number, total: number): number {
  const threshold = ATTENDANCE_THRESHOLD / 100; // 0.7
  if (total === 0 || (attended / total) >= threshold) {
    return 0;
  }
  // Formula: (attended + N) / (total + N) = threshold
  // Solved for N: N = (threshold * total - attended) / (1 - threshold)
  const needed = Math.ceil((threshold * total - attended) / (1 - threshold));
  return needed > 0 ? needed : 0;
}


/**
 * Calculates how many consecutive lectures a student can miss before dropping below the 70% threshold.
 * Only applies to students currently at or above 70%.
 * @param attended - Number of lectures attended.
 * @param total - Total lectures so far.
 * @returns The number of lectures that can be skipped.
 */
export function calculateSkippableLectures(attended: number, total: number): number {
    const threshold = ATTENDANCE_THRESHOLD / 100; // 0.7
    if (total === 0 || (attended / total) < threshold) {
        return 0;
    }
    // Formula: attended / (total + M) = threshold
    // Solved for M: M = (attended / threshold) - total
    const skippable = Math.floor((attended / threshold) - total);
    return skippable > 0 ? skippable : 0;
}
