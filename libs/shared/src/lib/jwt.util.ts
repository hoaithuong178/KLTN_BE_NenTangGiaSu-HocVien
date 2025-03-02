import * as jwt from 'jsonwebtoken';
import { JWTInput } from './dtos/auth.dto';

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = process.env;

if (
  !JWT_ACCESS_SECRET ||
  !JWT_REFRESH_SECRET ||
  !JWT_ACCESS_EXPIRATION ||
  !JWT_REFRESH_EXPIRATION
) {
  throw new Error('JWT secrets and expiration not set');
}

export const generateAccessToken = (user: JWTInput) => {
  return jwt.sign(user, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (user: JWTInput) => {
  return jwt.sign(user, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
