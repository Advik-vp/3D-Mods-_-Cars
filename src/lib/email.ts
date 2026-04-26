import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || 'smtp.gmail.com',
  port: EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true' || EMAIL_PORT === 465,
  auth: EMAIL_USER && EMAIL_PASSWORD ? {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  } : undefined,
});

export async function sendOtpEmail(email: string, otp: string) {
  const message = `Your verification code is ${otp}. It expires in 5 minutes.`;

  if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_HOST) {
    console.warn(`[SIMULATED OTP EMAIL] to=${email} otp=${otp}`);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your ModStudio Login OTP',
    text: message,
    html: `<p>${message}</p>`,
  });
}
