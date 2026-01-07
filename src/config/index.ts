import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGO_URI;

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection Error: : ${error.message}`);
    process.exit(1);
  }
};

export const initCollections = async (): Promise<void> => {
  const db = mongoose.connection.db;

  if (!db) return;

  const collections = await db.listCollections({ name: 'users' }).toArray();

  if (collections.length === 0) {
    await db.createCollection('users');
    console.log('Users Collection Created');
  } else {
    console.log('Users collection already exists');
  }
};
