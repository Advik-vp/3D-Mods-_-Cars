import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const car = searchParams.get('car');
    
    let query = {};
    if (car) {
      // Assuming car name might be short "Swift" or long "Maruti Suzuki Swift"
      // We regex match so any part of the string matches
      query = { compatibleCars: { $regex: new RegExp(car, 'i') } };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
