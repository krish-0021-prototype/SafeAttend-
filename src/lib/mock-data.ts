import { calculateRiskLevel, calculatePrediction } from '@/lib/attendanceUtils';
import type { Student, Branch, Division, Year } from '@/lib/types';

// Data from the user's diagram, now consolidated under one branch
const studentsData: { name: string; division: Division, branch: Branch, year: Year }[] = [
  // Division K - Automation & Robotics
  { name: 'Aditya', division: 'K', branch: 'Automation & Robotics', year: 1 },
  { name: 'Prachi', division: 'K', branch: 'Automation & Robotics', year: 2 },
  { name: 'Atul', division: 'K', branch: 'Automation & Robotics', year: 3 },
  { name: 'Gauri', division: 'K', branch: 'Automation & Robotics', year: 4 },
  { name: 'Purva', division: 'K', branch: 'Automation & Robotics', year: 1 },

  // Division P - Automation & Robotics
  { name: 'Kanishk', division: 'P', branch: 'Automation & Robotics', year: 2 },
  { name: 'OM', division: 'P', branch: 'Automation & Robotics', year: 3 },
  { name: 'Yogesh', division: 'P', branch: 'Automation & Robotics', year: 4 },
  { name: 'Kunal', division: 'P', branch: 'Automation & Robotics', year: 1 },
  { name: 'Srushti', division: 'P', branch: 'Automation & Robotics', year: 2 },

  // Division J - AI/ML
  { name: 'Riya', division: 'J', branch: 'AI/ML', year: 1 },
  { name: 'Maheey', division: 'J', branch: 'AI/ML', year: 2 },
  { name: 'Shravni', division: 'J', branch: 'AI/ML', year: 3 },
  { name: 'Shatakshi', division: 'J', branch: 'AI/ML', year: 4 },

  // Division H - ENTC
  { name: 'Shreya', division: 'H', branch: 'ENTC', year: 1 },
  { name: 'Soham', division: 'H', branch: 'ENTC', year: 2 },
  { name: 'Ronit', division: 'H', branch: 'ENTC', year: 3 },
];


// Function to generate somewhat realistic attendance data
function generateAttendance() {
  const total = Math.floor(Math.random() * 20) + 80; // Total lectures between 80 and 100
  const attended = Math.floor(Math.random() * (total - 55)) + 55; // Attendance between 55 and total
  return { attended, total };
}


export async function getMockStudents(): Promise<Student[]> {
  const students: Student[] = studentsData.map((s, index) => {
    let attended: number, total: number;

    if (s.name === 'Shreya') {
        attended = 45;
        total = 100;
    } else {
        const generated = generateAttendance();
        attended = generated.attended;
        total = generated.total;
    }
    
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
    const years: Year[] = [1, 2, 3, 4];
    const branches: Branch[] = ["AI/ML", "AIDS", "Automation & Robotics", "ENTC"];
    const divisions: Division[] = ["K", "P", "J", "H"];
    return {
        years: years.sort(),
        branches: branches.sort(),
        divisions: divisions.sort()
    }
}
