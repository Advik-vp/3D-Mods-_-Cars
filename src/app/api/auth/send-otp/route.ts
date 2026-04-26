import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth/jwt';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required for the OTP flow.' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'No account found for that email. Please sign up first.' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(email, otp);

    user.otpSecret = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60000);
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const tempToken = signToken({ id: user._id, type: '2FA_TEMP' });
    return NextResponse.json({ success: true, tempToken, method: 'email' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Unable to dispatch OTP request.' }, { status: 500 });
  }
}
