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
  prompt: `You are an automated attendance alert system. Generate a concise and clear notification message for a student who is in the critical zone.

  Student Name: {{name}}
  Overall Attendance: {{overallAttendance}}%
  Prediction: {{missableLectures}}

  The message should be suitable for SMS or an email subject line. It should state their attendance, their critical status, and the action required.

  Example: "Attendance Alert for {{name}}: You are at {{overallAttendance}}% (Critical). {{missableLectures}} to avoid detention."

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
