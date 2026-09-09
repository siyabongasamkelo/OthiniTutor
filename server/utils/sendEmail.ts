import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const transporter: Mail = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<SentMessageInfo> => {
  try {
    const info = await transporter.sendMail({
      // IMPORTANT: Brevo requires the 'from' email to be VERIFIED in your dashboard
      from: `"Clinic App" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error: any) {
    console.error("BREVO ERROR:", error.message);
    throw new Error("Email could not be sent via Brevo");
  }
};

export default sendEmail;
