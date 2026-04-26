import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { tempToken } = await req.json();

    const decoded = verifyToken(tempToken);
    if (!decoded || decoded.type !== '2FA_TEMP' || !decoded.id) {
      return NextResponse.json({ error: 'Isolated timeout session validation error' }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: 'Session binding target missing globally.' }, { status: 404 });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULATED 2FA OTP RESEND for ${user.email}]: ${newOtp}`);

    user.otpSecret = await bcrypt.hash(newOtp, 10);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60000);
    await user.save();

    return NextResponse.json({ success: true, message: '2FA Hash transmission renewed over trusted simulated networks.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Resend protocol failure handled exception' }, { status: 500 });
  }
}
