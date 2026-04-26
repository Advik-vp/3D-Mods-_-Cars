import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken, setCookie } from '@/lib/auth/jwt';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { idToken, phoneNumber } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing Firebase ID Token' }, { status: 400 });
    }

    // Verify Firebase token (we'll wrap in try-catch in case it's mock and fails)
    let decodedToken;
    try {
      if (!adminAuth) throw new Error('Firebase admin not initialized');
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.warn('Firebase token verification failed (could be mocked config)', error);
      // For local testing without valid Firebase config, we can bypass if we are sure it's dev
      // BUT for production, we MUST fail here.
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        return NextResponse.json({ error: 'Invalid Firebase ID Token' }, { status: 401 });
      }
      // Mock flow for dev if no real config provided
      decodedToken = { uid: 'mock-uid', phone_number: phoneNumber };
    }

    const verifiedPhone = decodedToken.phone_number || phoneNumber;

    if (!verifiedPhone) {
      return NextResponse.json({ error: 'No phone number linked to this Firebase account' }, { status: 400 });
    }

    // Find or create user by phone number
    let user = await User.findOne({ phoneNumber: verifiedPhone });

    if (!user) {
      // Register new user with this phone
      user = await User.create({
        name: `User ${verifiedPhone.substring(verifiedPhone.length - 4)}`,
        phoneNumber: verifiedPhone,
        // Using a dummy email since email is required by schema, or modify schema to allow phone-only
        email: `${verifiedPhone.replace('+', '')}@phone-login.local`,
        password: Math.random().toString(36).slice(-10), // Random password, they login via OTP
        isEmailVerified: true, // Phone is verified
      });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Issue standard JWT to bridge into existing app architecture
    const token = signToken({ id: user._id, email: user.email });
    await setCookie(token);

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, phone: user.phoneNumber, carModel: user.carModel, profilePicture: user.profilePicture } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Error authenticating with Firebase' }, { status: 500 });
  }
}
