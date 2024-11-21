import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose;
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (global.mongoose.conn) {
    console.log('Using existing MongoDB connection');
    return global.mongoose.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: true,
    };

    global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    console.log('New MongoDB connection established');
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }

  return global.mongoose.conn;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (global.mongoose.conn) {
    await global.mongoose.conn.disconnect();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
