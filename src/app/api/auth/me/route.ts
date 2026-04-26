import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthToken, verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
