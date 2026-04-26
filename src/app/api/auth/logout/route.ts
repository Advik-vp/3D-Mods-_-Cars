import { NextResponse } from 'next/server';
import { clearCookie } from '@/lib/auth/jwt';

export async function POST() {
  await clearCookie();
  return NextResponse.json({ message: 'Logged out successfully' });
}
