import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Modification from '@/models/Modification';

export async function GET() {
  try {
    await connectToDatabase();
    const mods = await Modification.find({ isPublic: true }).sort({ likes: -1, createdAt: -1 }).limit(50);
    return NextResponse.json({ modifications: mods });
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve timeline' }, { status: 500 });
  }
}
