import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ExternalCar from '@/models/ExternalCar';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await connectDB();
    const car = await ExternalCar.findById(id).lean();
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    return NextResponse.json({ car });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
