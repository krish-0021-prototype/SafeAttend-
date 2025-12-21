import { calculateRiskLevel } from '@/lib/attendanceUtils';
import type { Student, Branch, Division, Year } from '@/lib/types';

// Data from the user's diagram, now consolidated under one branch
const studentsData: { name: string; division: Division, branch: Branch, year: Year, attended: number, total: number, email: string }[] = [
  // Division K - Automation & Robotics
  { name: 'Aditya', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 85, total: 95, email: 'aditya@example.com' },
  { name: 'Prachi', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 90, total: 100, email: 'prachi@example.com' },
  { name: 'Atul', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 72, total: 90, email: 'atul@example.com' },
  { name: 'Gauri', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 65, total: 100, email: 'gauri@example.com' },
  { name: 'Purva', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 88, total: 92, email: 'purva@example.com' },

  // Division P - Automation & Robotics
  { name: 'Kanishk', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 81, total: 98, email: 'kanishk@example.com' },
  { name: 'OM', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 75, total: 85, email: 'om@example.com' },
  { name: 'Yogesh', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 95, total: 100, email: 'yogesh@example.com' },
  { name: 'Kunal', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 68, total: 95, email: 'kunal@example.com' },
  { name: 'Srushti', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 89, total: 90, email: 'srushti@example.com' },

  // Division J - AI/ML
  { name: 'Riya', division: 'J', branch: 'AI/ML', year: 1, attended: 92, total: 94, email: 'riya@example.com' },
  { name: 'Maheey', division: 'J', branch: 'AI/ML', year: 1, attended: 78, total: 88, email: 'maheey@example.com' },
  { name: 'Shravni', division: 'J', branch: 'AI/ML', year: 1, attended: 83, total: 99, email: 'shravni@example.com' },
  { name: 'Shatakshi', division: 'J', branch: 'AI/ML', year: 1, attended: 60, total: 90, email: 'shatakshi@example.com' },

  // Division H - ENTC
  { name: 'Shreya', division: 'H', branch: 'ENTC', year: 1, attended: 45, total: 100, email: 'shreya@example.com' },
  { name: 'Soham', division: 'H', branch: 'ENTC', year: 1, attended: 80, total: 85, email: 'soham@example.com' },
  { name: 'Ronit', division: 'H', branch: 'ENTC', year: 1, attended: 71, total: 100, email: 'ronit@example.com' },
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
      aiAdvice: `This is a static placeholder for AI-generated advice for ${s.name}.`,
      subjects: [{
        subjectName: 'Data Structures', // Example subject
        totalLectures: s.total,
        attendedLectures: s.attended,
        percentage: overallAttendance
      }],
      email: s.email
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
