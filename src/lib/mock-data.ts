import { calculateRiskLevel } from '@/lib/attendanceUtils';
import type { Student, Branch, Division, Year } from '@/lib/types';

// Data from the user's diagram, now consolidated under one branch
const studentsData: { name: string; email: string; division: Division, branch: Branch, year: Year, attended: number, total: number }[] = [
  // Division K - Automation & Robotics
  { name: 'Aditya', email: 'aditya@example.com', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 85, total: 100 }, // 85%
  { name: 'Prachi', email: 'prachi@example.com', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 90, total: 100 }, // 90%
  { name: 'Atul', email: 'atul@example.com', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 72, total: 100 }, // 72%
  { name: 'Gauri', email: 'gauri@example.com', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 75, total: 100 }, // 75%
  { name: 'Purva', email: 'purva@example.com', division: 'K', branch: 'Automation & Robotics', year: 1, attended: 88, total: 100 }, // 88%

  // Division P - Automation & Robotics
  { name: 'Kanishk', email: 'kanishkwankhede2122@gmail.com', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 59, total: 100 }, // 59%
  { name: 'OM', email: 'om@example.com', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 75, total: 100 }, // 75%
  { name: 'Yogesh', email: 'yogesh@example.com', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 95, total: 100 }, // 95%
  { name: 'Kunal', email: 'kunal@example.com', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 78, total: 100 }, // 78%
  { name: 'Srushti', email: 'srushti@example.com', division: 'P', branch: 'Automation & Robotics', year: 1, attended: 89, total: 100 }, // 89%

  // Division J - AI/ML
  { name: 'Riya', email: 'riya@example.com', division: 'J', branch: 'AI/ML', year: 1, attended: 92, total: 100 }, // 92%
  { name: 'Maheey', email: 'maheey@example.com', division: 'J', branch: 'AI/ML', year: 1, attended: 78, total: 100 }, // 78%
  { name: 'Shravni', email: 'shravni@example.com', division: 'J', branch: 'AI/ML', year: 1, attended: 83, total: 100 }, // 83%
  { name: 'Shatakshi', email: 'shatakshi@example.com', division: 'J', branch: 'AI/ML', year: 1, attended: 80, total: 100 }, // 80%

  // Division H - ENTC
  { name: 'Shreya', email: 'shreya@example.com', division: 'H', branch: 'ENTC', year: 1, attended: 85, total: 100 }, // 85%
  { name: 'Soham', email: 'soham@example.com', division: 'H', branch: 'ENTC', year: 1, attended: 80, total: 100 }, // 80%
  { name: 'Ronit', email: 'ronit@example.com', division: 'H', branch: 'ENTC', year: 1, attended: 71, total: 100 }, // 71%
];


export async function getMockStudents(): Promise<Student[]> {
  const students: Student[] = studentsData.map((s, index) => {
    const overallAttendance = s.total > 0 ? (s.attended / s.total) * 100 : 0;
    const riskLevel = calculateRiskLevel(overallAttendance);
    
    const student: Student = {
      id: (index + 1).toString(),
      name: s.name,
      email: s.email,
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
