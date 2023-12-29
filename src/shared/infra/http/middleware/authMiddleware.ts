import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { NotFoundError, UnauthorizedError } from '../../../errors/Error';
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
    throw new UnauthorizedError('Authorization header missing');
  }
  const decoded = verify(authToken, 'SUPER-SECRET-KEY') as DecodedUser;
  const user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  req.user = user;
  next();
};

export { authenticateToken };
