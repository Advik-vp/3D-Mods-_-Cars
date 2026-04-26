import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken, setCookie } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, carModel, phoneNumber } = await req.json();

    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields including phone number' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      carModel: carModel || 'Standard Sedan',
    });

    const token = signToken({ id: user._id, email: user.email });
    await setCookie(token);

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, carModel: user.carModel, profilePicture: user.profilePicture } 
    }, { status: 201 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Error creating user' }, { status: 500 });
  }
}
