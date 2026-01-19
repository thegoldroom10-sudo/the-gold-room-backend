import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Unauthorized');
  }
};
