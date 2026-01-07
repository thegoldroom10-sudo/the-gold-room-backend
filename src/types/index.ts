import { Request, Response } from 'express';
import { Schema, model, Document } from 'mongoose';

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