import jwt from 'jsonwebtoken';
// import { Response } from 'express';
import { JwtPayload } from '../types';

const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// const ACCESS_COOKIE_MAX_AGE = 30 * 60 * 1000; // 30 minutes
// const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generates access & refresh tokens and sets them as HTTP-only cookies
 */
export const generateTokens = (user: any) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are not defined');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  const payload: JwtPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Access Token (short-lived)
  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  });

  // Refresh Token (long-lived)
  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  });

  return {
    accessToken,
    refreshToken,
  };

  // Access token cookie
  // res.cookie('accessToken', accessToken, {
  //   httpOnly: true,
  //   secure: isProduction,
  //   sameSite: isProduction ? 'none' : 'lax',
  //   maxAge: ACCESS_COOKIE_MAX_AGE,
  // });

  // Refresh token cookie
  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: isProduction,
  //   sameSite: isProduction ? 'none' : 'lax',
  //   path: '/api/auth/refresh',
  //   maxAge: REFRESH_COOKIE_MAX_AGE,
  // });
};
