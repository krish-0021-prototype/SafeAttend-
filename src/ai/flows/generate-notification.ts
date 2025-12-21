'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a notification message for a student.
 *
 * - `generateNotification`: A function that takes student attendance data and returns a notification message.
 * - `GenerateNotificationInput`: The input type for the `generateNotification` function.
 * - `GenerateNotificationOutput`: The return type for the `generateNotification` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotificationInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  overallAttendance: z
    .number()
    .describe('The overall attendance percentage of the student.'),
  riskLevel: z
    .string()
    .describe('The risk level of the student (Warning or Critical).'),
  requiredLectures: z
    .number()
    .describe(
      'A calculation of how many lectures the student must attend to reach the 70% attendance threshold.'
    ),
});
export type GenerateNotificationInput = z.infer<
  typeof GenerateNotificationInputSchema
>;

const GenerateNotificationOutputSchema = z.object({
  message: z
    .string()
    .describe(
      'A concise notification message to be sent to the student via Email or SMS.'
    ),
});
export type GenerateNotificationOutput = z.infer<
  typeof GenerateNotificationOutputSchema
>;

export async function generateNotification(
  input: GenerateNotificationInput
): Promise<GenerateNotificationOutput> {
  return generateNotificationFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: {schema: GenerateNotificationInputSchema},
  output: {schema: GenerateNotificationOutputSchema},
  prompt: `You are an automated attendance alert system. Generate a concise and clear SMS notification for a student based on their attendance data.

  Student Name: {{name}}
  Current Attendance: {{overallAttendance}}%
  Risk Level: {{riskLevel}}
  Required Lectures to reach 70%: {{requiredLectures}}

  The message should be suitable for an SMS or Email. It must state their current attendance, their risk status, and a clear, calculated action to get back to the safe zone (above 70%).

  - For 'Warning' status, the tone should be a firm reminder.
  - For 'Critical' status, the tone should be urgent and clearly state the number of lectures they MUST attend.
  - The call to action should be to contact their academic advisor and to attend the required lectures.

  Example for Critical: "URGENT Attendance Alert for {{name}}: Your attendance is CRITICAL at {{overallAttendance}}%. You must attend the next {{requiredLectures}} lectures to get back to the safe zone. Please contact your advisor immediately."
  Example for Warning: "Attendance Warning for {{name}}: Your attendance is at {{overallAttendance}}%. To avoid falling into the critical zone, you must attend at least {{requiredLectures}} more lectures. Please contact your advisor."

  Generate the notification message now.
  `,
});

const generateNotificationFlow = ai.defineFlow(
  {
    name: 'generateNotificationFlow',
    inputSchema: GenerateNotificationInputSchema,
    outputSchema: GenerateNotificationOutputSchema,
  },
  async input => {
    const {output} = await notificationPrompt(input);
    return output!;
  }
);
