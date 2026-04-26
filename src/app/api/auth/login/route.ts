import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken, setCookie } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return NextResponse.json({ error: 'Account temporarily locked preventing brute-force. Try again later.' }, { status: 403 });
    }

    if (user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Simulated delivery pipeline intercept
      console.log(`[SIMULATED 2FA OTP DISPATCH for ${email}]: ${otp}`);
      
      user.otpSecret = await bcrypt.hash(otp, 10);
      user.otpExpiresAt = new Date(Date.now() + 5 * 60000); // 5 mins strict TTL
      await user.save();

      const tempToken = signToken({ id: user._id, type: '2FA_TEMP' });
      return NextResponse.json({ 
        requires2FA: true, 
        tempToken, 
        method: user.twoFactorEnabled.email ? 'email' : 'phone' 
      });
    }

    // Direct Login Pipeline
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = signToken({ id: user._id, email: user.email });
    await setCookie(token);

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, carModel: user.carModel, profilePicture: user.profilePicture } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Error logging in' }, { status: 500 });
  }
}
