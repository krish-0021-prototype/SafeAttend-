'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized attendance advice to students.
 *
 * The flow takes a student's attendance record as input and uses an AI model to generate personalized advice.
 * The advice includes the student's risk level and suggestions on how to improve their attendance.
 *
 * - `getPersonalizedAttendanceAdvice`: A function that takes student attendance data and returns personalized advice.
 * - `PersonalizedAttendanceAdviceInput`: The input type for the `getPersonalizedAttendanceAdvice` function.
 * - `PersonalizedAttendanceAdviceOutput`: The return type for the `getPersonalizedAttendanceAdvice` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAttendanceAdviceInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  overallAttendance: z
    .number()
    .describe('The overall attendance percentage of the student.'),
  riskLevel: z
    .string()
    .describe(
      'The risk level of the student (Safe, Warning, or Critical) based on their attendance.'
    ),
});
export type PersonalizedAttendanceAdviceInput = z.infer<
  typeof PersonalizedAttendanceAdviceInputSchema
>;

const PersonalizedAttendanceAdviceOutputSchema = z.object({
  aiAdvice: z.string().describe('Personalized advice for the student.'),
});
export type PersonalizedAttendanceAdviceOutput = z.infer<
  typeof PersonalizedAttendanceAdviceOutputSchema
>;

export async function getPersonalizedAttendanceAdvice(
  input: PersonalizedAttendanceAdviceInput
): Promise<PersonalizedAttendanceAdviceOutput> {
  return personalizedAttendanceAdviceFlow(input);
}

const personalizedAttendanceAdvicePrompt = ai.definePrompt({
  name: 'personalizedAttendanceAdvicePrompt',
  input: {schema: PersonalizedAttendanceAdviceInputSchema},
  output: {schema: PersonalizedAttendanceAdviceOutputSchema},
  prompt: `You are an Academic Attendance Advisor, providing personalized advice to students based on their attendance record.

  Student Name: {{name}}
  Overall Attendance: {{overallAttendance}}%
  Risk Level: {{riskLevel}}

  Provide personalized advice to the student, addressing their current risk level and suggesting actions to improve their attendance. Tailor the advice based on whether they are in the Safe, Warning, or Critical zone. If they are in a good position encourage them.
  If they are in danger, provide actionable advice.
  Example for Safe: "Great job, {{name}}! Your attendance is in the Safe zone. Keep up the good work!"
  Example for Critical: "Alert, {{name}}! Your attendance is in the Critical zone. You need to attend all upcoming lectures to avoid serious academic consequences. Please speak with your advisor immediately to create a plan."
  Remember to be encouraging and supportive. Format the output as a single paragraph.
  `, 
});

const personalizedAttendanceAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedAttendanceAdviceFlow',
    inputSchema: PersonalizedAttendanceAdviceInputSchema,
    outputSchema: PersonalizedAttendanceAdviceOutputSchema,
  },
  async input => {
    const {output} = await personalizedAttendanceAdvicePrompt(input);
    return output!;
  }
);
