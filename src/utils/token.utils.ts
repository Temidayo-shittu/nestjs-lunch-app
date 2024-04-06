// token.utils.ts

import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET; // Replace with your own secret key

export function generateToken(payload: any): string {
  return jwt.sign(payload, secretKey, { expiresIn: process.env.JWT_LIFETIME });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}
