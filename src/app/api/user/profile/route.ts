import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthToken, verifyToken } from '@/lib/auth/jwt';

export async function PUT(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { name, carModel, profilePicture, twoFactorEnabled } = await req.json();

    const updateData: Record<string, unknown> = { name, carModel, profilePicture };
    if (twoFactorEnabled !== undefined) {
      updateData.twoFactorEnabled = twoFactorEnabled;
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Error updating profile' }, { status: 500 });
  }
}
