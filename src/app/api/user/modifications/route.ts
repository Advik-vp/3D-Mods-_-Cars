import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Modification from '@/models/Modification';
import { getAuthToken, verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const modifications = await Modification.find({ userId: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json({ modifications });
  } catch {
    return NextResponse.json({ error: 'Error fetching modifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { name, carModel, config, previewImage } = await req.json();

    const modification = await Modification.create({
      userId: decoded.id,
      name,
      carModel,
      config,
      previewImage
    });

    return NextResponse.json({ modification }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error saving modification' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Modification ID required' }, { status: 400 });

    await connectToDatabase();
    const modification = await Modification.findOneAndDelete({ _id: id, userId: decoded.id });
    
    if (!modification) return NextResponse.json({ error: 'Modification not found or unauthorized' }, { status: 404 });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Error deleting modification' }, { status: 500 });
  }
}
