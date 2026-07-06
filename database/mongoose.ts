import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * We use a "cached" object to preserve the database connection 
 * across hot-reloads in Next.js development mode.
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// This line fixes the "let cached" error by casting global to 'any' 
// only for the purpose of checking the cache.
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    console.log("--- Connection Attempt Started ---");
  // 1. If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If we don't have a promise, create one to start the connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.info('Successfully connected to MongoDB');
      return mongooseInstance;
    });
  }

  // 3. Wait for the promise to resolve and store the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error so we can try again
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};