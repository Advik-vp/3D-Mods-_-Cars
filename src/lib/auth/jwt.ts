import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_car_modification_jwt_key_123!';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export type JwtPayload = {
  id?: string;
  userId?: string;
  email?: string;
  type?: string;
};

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

export async function clearCookie() {
  const cookieStore = await cookies();
  cookieStore.set('authToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');
  return token?.value;
}
