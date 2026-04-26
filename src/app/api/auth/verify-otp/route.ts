import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken, verifyToken, setCookie } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { tempToken, otp } = await req.json();

    if (!tempToken || !otp) {
      return NextResponse.json({ error: 'Missing token or OTP parameter constraints' }, { status: 400 });
    }

    const decoded = verifyToken(tempToken);
    if (!decoded || decoded.type !== '2FA_TEMP' || !decoded.id) {
      return NextResponse.json({ error: 'Invalid or expired multi-factor session trace' }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: 'User origin not mapped' }, { status: 404 });

    if (user.lockUntil && user.lockUntil > new Date()) {
      return NextResponse.json({ error: 'Account secured locked enforcing brute-force delays.' }, { status: 403 });
    }

    if (!user.otpSecret || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP challenge token timed out globally. Please resend.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, user.otpSecret);
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60000); // 15 mins block penalty
      }
      await user.save();
      return NextResponse.json({ error: `OTP resolution invalid. ${5 - user.failedLoginAttempts} traces remaining.` }, { status: 400 });
    }

    // Success Authentication Merge Payload
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.otpSecret = null;
    user.otpExpiresAt = null;
    await user.save();

    const auth_token = signToken({ id: user._id, email: user.email });
    await setCookie(auth_token);

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, carModel: user.carModel, profilePicture: user.profilePicture } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'OTP server network exception globally.' }, { status: 500 });
  }
}
