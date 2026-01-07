import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401);
    throw new Error('Unauthorized');
  }

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
