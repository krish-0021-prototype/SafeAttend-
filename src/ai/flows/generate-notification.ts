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
  missableLectures: z
    .string()
    .describe(
      'The prediction of how many lectures the student can miss or must attend.'
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
  prompt: `You are an automated attendance alert system. Generate a concise and clear SMS notification for a student.

  Student Name: {{name}}
  Overall Attendance: {{overallAttendance}}%
  Risk Level: {{riskLevel}}
  Prediction: {{missableLectures}}

  The message should be suitable for SMS. It must state their attendance, risk status, and a clear call to action.
  - For 'Warning' status, the tone should be a firm reminder.
  - For 'Critical' status, the tone should be urgent.
  - The call to action should be to contact their academic advisor.

  Example for Critical: "URGENT Attendance Alert for {{name}}: You are at {{overallAttendance}}% (Critical). {{missableLectures}}. Please contact your advisor immediately."
  Example for Warning: "Attendance Warning for {{name}}: Your attendance is {{overallAttendance}}%. {{missableLectures}}. Please contact your advisor to discuss."

  Generate the notification message.
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
