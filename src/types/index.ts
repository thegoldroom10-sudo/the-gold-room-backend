import { Request, Response } from 'express';
import { Schema, model, Document, Types } from 'mongoose';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidate: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

export interface ImageDocument {
  userId: Types.ObjectId;
  title: string;
  tags: string[];
  image: {
    original: {
      publicId: string;
      url: string;
      width: number;
      height: number;
    };
    cropped: {
      publicId: string;
      url: string;
      width: number;
      height: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CloudinaryResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
}

export interface ImageData {
  original: CloudinaryResult;
  cropped: CloudinaryResult;
}