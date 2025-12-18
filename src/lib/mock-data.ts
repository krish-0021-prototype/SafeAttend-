import { getPersonalizedAttendanceAdvice } from '@/ai/flows/personalized-attendance-advice';
import { calculateRiskLevel, calculatePrediction, getMissableLecturesForAI } from '@/lib/attendanceUtils';
import type { Student } from '@/lib/types';

// Raw data to be processed
const studentsData = [
  { id: '1', name: 'Alex Johnson', rollNumber: 'STU001', attended: 90, total: 100 }, // Safe (90%)
  { id: '2', name: 'Brenda Smith', rollNumber: 'STU002', attended: 76, total: 100 }, // Warning (76%)
  { id: '3', name: 'Charlie Brown', rollNumber: 'STU003', attended: 60, total: 100 }, // Critical (60%)
  { id: '4', name: 'Diana Prince', rollNumber: 'STU004', attended: 46, total: 50 },  // Safe (92%)
  { id: '5', name: 'Ethan Hunt', rollNumber: 'STU005', attended: 70, total: 95 },   // Critical (73.6%)
];

export async function getMockStudents(): Promise<Student[]> {
  const studentPromises = studentsData.map(async (s) => {
    const overallAttendance = s.total > 0 ? (s.attended / s.total) * 100 : 0;
    const riskLevel = calculateRiskLevel(overallAttendance);
    
    const aiResponse = await getPersonalizedAttendanceAdvice({
        name: s.name,
        overallAttendance: parseFloat(overallAttendance.toFixed(1)),
        riskLevel: riskLevel,
        missableLectures: getMissableLecturesForAI(s.attended, s.total)
    });

    const student: Student = {
      id: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      overallAttendance: overallAttendance,
      riskLevel: riskLevel,
      missableLectures: calculatePrediction(s.attended, s.total),
      aiAdvice: aiResponse.aiAdvice,
      subjects: [{
        subjectName: 'Data Structures',
        totalLectures: s.total,
        attendedLectures: s.attended,
        percentage: overallAttendance
      }]
    };
    return student;
  });

  return Promise.all(studentPromises);
}
