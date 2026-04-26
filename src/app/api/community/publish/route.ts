import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Modification from '@/models/Modification';

export async function POST(req: Request) {
  try {
     const { id } = await req.json();
     await connectToDatabase();
     const mod = await Modification.findByIdAndUpdate(id, { isPublic: true }, { new: true });
     return NextResponse.json({ success: true, mod });
  } catch {
     return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}
