import mongoose from 'mongoose';

// MONGODB_URI will be verified during runtime in connectToDatabase
const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache = (global as unknown as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };
(global as unknown as { mongoose?: MongooseCache }).mongoose = cached;

async function connectToDatabase() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
       console.warn('MONGODB_URI not defined, bypassing db connection for Next.js build');
       return null as any;
    } else {
       throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
