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
  missableLectures: z.number().describe('A calculation of how many lectures the student can miss before their attendance drops below 70%.'),
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
  Lectures they can miss before dropping below 70%: {{missableLectures}}

  The message should be suitable for an SMS or Email. It must state their current attendance (as a whole number), their risk status, and a clear, calculated action to improve or maintain their standing.

  - For 'Warning' status, the tone should be a firm reminder. Mention how many lectures they can miss.
  - For 'Critical' status, the tone should be urgent and clearly state the number of lectures they MUST attend to get back to the safe zone.
  - The call to action should be to attend the required lectures or be mindful of the missable lecture count. DO NOT mention contacting an advisor.

  Example for Critical: "URGENT Attendance Alert for {{name}}: Your attendance is CRITICAL at {{overallAttendance}}%. You must attend the next {{requiredLectures}} lectures to get back to the safe zone."
  Example for Warning: "Attendance Warning for {{name}}: Your attendance is at {{overallAttendance}}%. You can miss up to {{missableLectures}} lectures before falling into the critical zone. Please be careful."

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
    const {output} = await notificationPrompt({
      ...input,
      overallAttendance: Math.floor(input.overallAttendance)
    });
    return output!;
  }
);
