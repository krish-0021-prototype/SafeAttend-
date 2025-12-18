import { calculateRiskLevel, calculatePrediction } from '@/lib/attendanceUtils';
import type { Student, Branch, Division, Year } from '@/lib/types';

// Data from the user's diagram, now consolidated under one branch
const studentsData: { name: string; division: Division, branch: Branch, year: Year, attended: number, total: number }[] = [
  // Division K - Automation & Robotics
  { name: 'Aditya', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 85, total: 95 },
  { name: 'Prachi', division: 'K', branch: 'Automation & Robotics', year: 2, attended: 90, total: 100 },
  { name: 'Atul', division: 'K', branch: 'Automation & Robotics', year: 3, attended: 72, total: 90 },
  { name: 'Gauri', division: 'K', branch: 'Automation & Robotics', year: 4, attended: 65, total: 100 },
  { name: 'Purva', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 88, total: 92 },

  // Division P - Automation & Robotics
  { name: 'Kanishk', division: 'P', branch: 'Automation & Robotics', year: 2, attended: 81, total: 98 },
  { name: 'OM', division: 'P', branch: 'Automation & Robotics', year: 3, attended: 75, total: 85 },
  { name: 'Yogesh', division: 'P', branch: 'Automation & Robotics', year: 4, attended: 95, total: 100 },
  { name: 'Kunal', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 68, total: 95 },
  { name: 'Srushti', division: 'P', branch: 'Automation & Robotics', year: 2, attended: 89, total: 90 },

  // Division J - AI/ML
  { name: 'Riya', division: 'J', branch: 'AI/ML', year: 1, attended: 92, total: 94 },
  { name: 'Maheey', division: 'J', branch: 'AI/ML', year: 2, attended: 78, total: 88 },
  { name: 'Shravni', division: 'J', branch: 'AI/ML', year: 3, attended: 83, total: 99 },
  { name: 'Shatakshi', division: 'J', branch: 'AI/ML', year: 4, attended: 60, total: 90 },

  // Division H - ENTC
  { name: 'Shreya', division: 'H', branch: 'ENTC', year: 1, attended: 45, total: 100 },
  { name: 'Soham', division: 'H', branch: 'ENTC', year: 2, attended: 80, total: 85 },
  { name: 'Ronit', division: 'H', branch: 'ENTC', year: 3, attended: 71, total: 100 },
];


export async function getMockStudents(): Promise<Student[]> {
  const students: Student[] = studentsData.map((s, index) => {
    const overallAttendance = s.total > 0 ? (s.attended / s.total) * 100 : 0;
    const riskLevel = calculateRiskLevel(overallAttendance);
    
    const student: Student = {
      id: (index + 1).toString(),
      name: s.name,
      rollNumber: `STU${(index + 1).toString().padStart(3, '0')}`,
      year: s.year,
      branch: s.branch,
      division: s.division,
      overallAttendance: overallAttendance,
      riskLevel: riskLevel,
      missableLectures: calculatePrediction(s.attended, s.total),
      aiAdvice: `This is a static placeholder for AI-generated advice for ${s.name}.`,
      subjects: [{
        subjectName: 'Data Structures', // Example subject
        totalLectures: s.total,
        attendedLectures: s.attended,
        percentage: overallAttendance
      }]
    };
    return student;
  });

  return Promise.resolve(students);
}

export async function getFilterOptions() {
    const years: Year[] = [1, 2, 3, 4];
    const branches: Branch[] = ["AI/ML", "AIDS", "Automation & Robotics", "ENTC"];
    const divisions: Division[] = ["K", "P", "J", "H"];
    return {
        years: years.sort(),
        branches: branches.sort(),
        divisions: divisions.sort()
    }
}
