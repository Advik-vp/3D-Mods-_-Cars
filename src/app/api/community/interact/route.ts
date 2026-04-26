import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Modification from '@/models/Modification';

export async function POST(req: Request) {
  try {
     const { id, action, text } = await req.json();
     await connectToDatabase();
     const mod = await Modification.findById(id);
     
     if (!mod) return NextResponse.json({ error: 'Not found' }, { status: 404 });
     
     if (action === 'like') {
       mod.likes += 1;
     } else if (action === 'comment') {
       mod.comments.push({ userName: 'Community Critic', text, createdAt: new Date() });
     }
     
     await mod.save();
     return NextResponse.json({ success: true, mod });
  } catch {
     return NextResponse.json({ error: 'Interaction Failed' }, { status: 500 });
  }
}
