export interface Subject {
  subjectName: string;
  totalLectures: number;
  attendedLectures: number;
  percentage: number;
}

export type RiskLevel = "Safe" | "Warning" | "Critical";

export type Year = 1 | 2 | 3 | 4;
export type Branch = "AI/ML" | "AIDS" | "Automation & Robotics" | "ENTC";
export type Division = "K" | "P" | "J" | "H";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: Year;
  branch: Branch;
  division: Division;
  email: string;
  phone: string;
  subjects: Subject[];
  overallAttendance: number;
  riskLevel: RiskLevel;
  aiAdvice: string;
}
