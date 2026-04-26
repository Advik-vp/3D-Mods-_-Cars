import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { INDIAN_CARS } from '@/lib/constants';

const SAMPLE_PRODUCTS = [
  {
    name: "Sparco Racing Carbon Spoiler",
    brand: "Sparco",
    category: "Spoilers",
    price: 18500,
    compatibleCars: ["Swift", "Baleno", "i20", "Glanza", "Fronx", "Tiago"],
    image: "https://images.unsplash.com/photo-1601625463687-f2b1c4e72352?auto=format&fit=crop&q=80&w=600",
    description: "Aerodynamic real carbon fiber rear wing for high-speed stability and aggressive styling."
  },
  {
    name: "Momo Italy Hyperstar Alloys (16-inch)",
    brand: "Momo",
    category: "Alloy Wheels",
    price: 45000,
    compatibleCars: ["Creta", "Nexon", "Thar", "Harrier", "Scorpio N", "Venue", "Alcazar"],
    image: "https://images.unsplash.com/photo-1628173456885-ee6e37fd6dbe?auto=format&fit=crop&q=80&w=600",
    description: "Premium forged 16-inch alloy wheels featuring a stunning diamond-cut dark finish."
  },
  {
    name: "Hella LED Matrix Headlights",
    brand: "Hella",
    category: "LED Headlights",
    price: 24000,
    compatibleCars: ["Thar", "Scorpio N", "Fortuner", "Innova Crysta", "Safari"],
    image: "https://images.unsplash.com/photo-1542382103328-97103ce5cbff?auto=format&fit=crop&q=80&w=600",
    description: "Ultra-bright adaptive LED projector arrays for ultimate nighttime off-roading."
  },
  {
    name: "Bosch Performance Exhaust System",
    brand: "Bosch",
    category: "Performance Exhausts",
    price: 32000,
    compatibleCars: ["City", "Verna", "Slavia", "Elevate"],
    image: "https://images.unsplash.com/photo-1616782500140-62281a62ccbf?auto=format&fit=crop&q=80&w=600",
    description: "Cat-back exhaust system granting +5% HP and a deep, aggressive engine roar."
  },
  {
    name: "3M Dark Knight Window Tint Kit",
    brand: "3M Car Care",
    category: "Window Tint Kits",
    price: 4500,
    compatibleCars: INDIAN_CARS.flatMap(b => b.models), // Universal
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600",
    description: "Premium heat-rejection 10% VLT ceramic nano-tinting."
  },
  {
    name: "Nismo Matte Black Body Kit",
    brand: "Custom",
    category: "Body Kits",
    price: 28000,
    compatibleCars: ["Swift", "Baleno", "Glanza", "i20"],
    image: "https://images.unsplash.com/photo-1536353195237-775c74eb58db?auto=format&fit=crop&q=80&w=600",
    description: "Aggressive front splitter, side skirts, and rear diffuser in matte black."
  }
];

export async function GET() {
  await connectToDatabase();
  await Product.deleteMany({}); // Clear existing
  await Product.insertMany(SAMPLE_PRODUCTS);
  return NextResponse.json({ message: 'Marketplace Seeded Successfully!' });
}
