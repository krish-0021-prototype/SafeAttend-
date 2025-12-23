'use server';

import { Resend } from 'resend';

// Important: This function should only be called from the server,
// for example, in other Server Actions or Route Handlers.
// Never expose this to the client-side.

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

/**
 * Sends an email using the Resend API.
 * This is a Server Action and should only be executed on the server.
 * @param {SendEmailParams} params - The parameters for sending the email.
 * @returns {Promise<{ success: boolean; message: string }>} - The result of the send operation.
 */
export async function sendEmail({ to, subject, body }: SendEmailParams): Promise<{ success: boolean; message: string }> {
  // Defensive check to ensure API keys are set in the environment.
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    console.error('Missing RESEND_API_KEY or FROM_EMAIL environment variables.');
    return {
      success: false,
      message: 'Server is not configured for sending emails. Missing API key or from address.',
    };
  }

  // Initialize Resend with the API key from environment variables inside the function.
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL;

  try {
    // The core API call to Resend to send the email.
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: `<p>${body}</p>`, // We wrap the plain text body in a simple HTML paragraph.
    });

    // If Resend returns an error, we log it and return a failure response.
    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, message: `Failed to send email: ${error.message}` };
    }

    // If the email is sent successfully, return a success response.
    console.log('Email sent successfully:', data);
    return { success: true, message: 'Email sent successfully.' };
  } catch (exception) {
    // Catch any other unexpected errors during the process.
    console.error('Error sending email:', exception);
    return { success: false, message: 'An unexpected error occurred while sending the email.' };
  }
}
