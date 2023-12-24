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
  const token = req.cookies.token;
  try {
    const decodedUser = verify(token, 'SUPER-SECRET-KEY') as DecodedUser;
    console.log(decodedUser);
    const user = await prisma.user.findUnique({ where: { id: decodedUser.userId } });
    req.user = user;
    next();
    return user;
  } catch (err) {
    console.error('Token Verification Failed: ', err);
    return null;
  }
};

export { authenticateToken };
