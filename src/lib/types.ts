export interface Subject {
  subjectName: string;
  totalLectures: number;
  attendedLectures: number;
  percentage: number;
}

export type RiskLevel = "Safe" | "Warning" | "Critical";

export type Year = 1 | 2 | 3 | 4;
export type Branch = "AI/ML" | "AIDS" | "Automation & Robotics";
export type Division = "K" | "P" | "J";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: Year;
  branch: Branch;
  division: Division;
  subjects: Subject[];
  overallAttendance: number;
  riskLevel: RiskLevel;
  aiAdvice: string;
  // This is the string for the 'Prediction' column in the UI
  missableLectures: string; 
}
