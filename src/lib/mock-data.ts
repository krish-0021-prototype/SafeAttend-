import { calculateRiskLevel, calculatePrediction } from '@/lib/attendanceUtils';
import type { Student, Branch, Division, Year } from '@/lib/types';

// Data from the user's diagram
const studentsData: { name: string; division: Division, branch: Branch, year: Year }[] = [
  // Division K - Let's assign them to different branches/years for variety
  { name: 'Aditya', division: 'K', branch: 'AI/ML', year: 1 },
  { name: 'Prachi', division: 'K', branch: 'AIDS', year: 2 },
  { name: 'Atul', division: 'K', branch: 'Automation & Robotics', year: 3 },
  { name: 'Gauri', division: 'K', branch: 'AI/ML', year: 4 },
  { name: 'Purva', division: 'K', branch: 'AIDS', year: 1 },

  // Division P
  { name: 'Kanishk', division: 'P', branch: 'Automation & Robotics', year: 2 },
  { name: 'OM', division: 'P', branch: 'AI/ML', year: 3 },
  { name: 'Yogesh', division: 'P', branch: 'AIDS', year: 4 },
  { name: 'Kunal', division: 'P', branch: 'Automation & Robotics', year: 1 },
  { name: 'Srushti', division: 'P', branch: 'AI/ML', year: 2 },
];


// Function to generate somewhat realistic attendance data
function generateAttendance() {
  const total = Math.floor(Math.random() * 20) + 80; // Total lectures between 80 and 100
  const attended = Math.floor(Math.random() * (total - 55)) + 55; // Attendance between 55 and total
  return { attended, total };
}


export async function getMockStudents(): Promise<Student[]> {
  const students: Student[] = studentsData.map((s, index) => {
    const { attended, total } = generateAttendance();
    const overallAttendance = total > 0 ? (attended / total) * 100 : 0;
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
      missableLectures: calculatePrediction(attended, total),
      aiAdvice: `This is a static placeholder for AI-generated advice for ${s.name}.`,
      subjects: [{
        subjectName: 'Data Structures', // Example subject
        totalLectures: total,
        attendedLectures: attended,
        percentage: overallAttendance
      }]
    };
    return student;
  });

  return Promise.resolve(students);
}

export async function getFilterOptions() {
    const years = [...new Set(studentsData.map(s => s.year))];
    const branches = [...new Set(studentsData.map(s => s.branch))];
    const divisions = [...new Set(studentsData.map(s => s.division))];
    return {
        years: years.sort(),
        branches: branches.sort(),
        divisions: divisions.sort()
    }
}
