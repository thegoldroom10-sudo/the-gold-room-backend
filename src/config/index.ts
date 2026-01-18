import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

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

  const collectionNames = ['users', 'images'];

  for (const name of collectionNames) {
    const collections = await db.listCollections({ name }).toArray();

    if (collections.length === 0) {
      await db.createCollection(name);
      console.log(`${name} collection created`);
    } else {
      console.log(`${name} collection already exists`);
    }
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const cloudinaryInstance = cloudinary;
