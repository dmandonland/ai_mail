"use server"
import nodemailer from "nodemailer";
// This is a server action to simulate sending an email.
// In a real application, you would use a library like Nodemailer
// and connect to an SMTP server using credentials from environment variables.
// For example, see Vercel's guide on sending emails: https://vercel.com/guides/sending-emails-from-an-application-on-vercel [^3]

export async function sendEmailAction(formData: FormData) {
  const to = formData.get("to") as string
  const subject = formData.get("subject") as string
  const body = formData.get("body") as string

  // Basic validation
  if (!to || !subject || !body) {
    return { success: false, message: "Missing required fields." }
  }
  if (!to.includes("@")) {
    // very basic email validation
    return { success: false, message: "Invalid 'To' email address." }
  }

  console.log("Simulating email send:")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("Body:", body)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real scenario:
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_FROM_EMAIL}>`, // Sender address
      to: to,
      subject: subject,
      html: body.replace(/\n/g, '<br/>'), // Basic HTML conversion
    });
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, message: "Failed to send email." };
  }

  return { success: true, message: "Email processed (simulated)." }
}

// Conceptual AI action (not fully implemented)
// import { generateText } from 'ai';
// import { openai } from '@ai-sdk/openai'; // Ensure you have @ai-sdk/openai installed

// export async function summarizeEmailAction(emailContent: string) {
//   if (!process.env.OPENAI_API_KEY) {
//     return { success: false, summary: null, message: "OpenAI API key not configured." };
//   }
//   try {
//     const { text } = await generateText({
//       model: openai('gpt-3.5-turbo'), // Or your preferred model
//       prompt: `Summarize the following email concisely:\n\n${emailContent}`,
//     });
//     return { success: true, summary: text, message: "Summary generated." };
//   } catch (error) {
//     console.error("AI summarization error:", error);
//     return { success: false, summary: null, message: "Failed to generate summary." };
//   }
// }
