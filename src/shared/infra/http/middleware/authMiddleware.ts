import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { prisma } from '../../prisma/prismaClient';

export interface DecodedUser {
  userId: string;
  username: string;
  email: string;
  password: string;
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.token;
  if (!authToken) {
    const error = new Error('Authorization header missing');
    return next(error);
  }
  const decoded = verify(authToken, 'SUPER-SECRET-KEY') as DecodedUser;
  const user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    const authError = new Error('User not found');
    return next(authError);
  }
  req.user = user;
  next();
};

export { authenticateToken };
