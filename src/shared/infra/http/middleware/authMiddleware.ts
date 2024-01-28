import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { InternalServerError, NotFoundError, UnauthorizedError } from '../../../errors/Error';
import { prisma } from '../../prisma/prismaClient';

export interface DecodedUser {
  userId: string;
  username: string;
  email: string;
  password: string;
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) throw new UnauthorizedError('Authorization header missing');
    if (authToken.startsWith('Bearer ')) {
      const token = authToken.split(' ')[1];
      const decoded = verify(token, process.env.JWT_SECRET as string) as DecodedUser;
      const user = await prisma.user.findUnique({ where: { email: decoded.email } });
      if (!user) throw new NotFoundError('User not found');
      req.user = user;
      next();
    }
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) throw error;
    throw new InternalServerError('Unhandled Internal Server Error');
  }
};

export { authenticateToken };
