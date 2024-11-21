import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
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

    global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log('New MongoDB connection established');
      return mongoose;
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
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
    process.exit(0);
  }
});
