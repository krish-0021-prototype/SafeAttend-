export interface Subject {
  subjectName: string;
  totalLectures: number;
  attendedLectures: number;
  percentage: number;
}

export type RiskLevel = "Safe" | "Warning" | "Critical";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  subjects: Subject[];
  overallAttendance: number;
  riskLevel: RiskLevel;
  aiAdvice: string;
  // This is the string for the 'Prediction' column in the UI
  missableLectures: string; 
}
