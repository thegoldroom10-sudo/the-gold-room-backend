import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token invalid or expired');
  }
};
