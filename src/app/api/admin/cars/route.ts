import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import ExternalCar from '@/models/ExternalCar';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

type AdminTokenPayload = { userId?: string };

type AdminUser = { _id: string; isAdmin?: boolean } & Record<string, unknown>;

async function getAdminUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    await connectDB();
    const user = await User.findById(decoded.userId).lean() as AdminUser | null;
    if (!user || !user.isAdmin) return null;
    return user;
  } catch {
    return null;
  }
}

/** Extract Sketchfab model ID from various URL formats */
function extractSketchfabId(url: string): string | null {
  const shortMatch = url.match(/skfb\.ly\/([a-zA-Z0-9]+)/);
  if (shortMatch) return shortMatch[1];
  const fullMatch = url.match(/sketchfab\.com\/3d-models\/[^/]+-([a-f0-9]{32})/);
  if (fullMatch) return fullMatch[1];
  const modelMatch = url.match(/sketchfab\.com\/models\/([a-f0-9]{32})/);
  if (modelMatch) return modelMatch[1];
  return null;
}

export async function GET() {
  await connectDB();
  const cars = await ExternalCar.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ cars });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { brand, name, year, category, sketchfabUrl, previewImage } = body;

    if (!brand || !name || !year || !category || !sketchfabUrl) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const sketchfabModelId = extractSketchfabId(sketchfabUrl);
    if (!sketchfabModelId) {
      return NextResponse.json({ error: 'Invalid Sketchfab URL. Please provide a valid skfb.ly or sketchfab.com link.' }, { status: 400 });
    }

    await connectDB();
    const car = await ExternalCar.create({
      brand, name, year: Number(year), category,
      sketchfabUrl, sketchfabModelId,
      previewImage: previewImage || '',
      addedBy: admin._id,
    });

    return NextResponse.json({ success: true, car }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
