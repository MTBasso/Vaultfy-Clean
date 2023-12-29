import { Request, Response } from 'express';

import { ApiError } from '../../../errors/Error';

const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : 'Internal Server Error';
  return res.status(statusCode).json({ message });
};

export { errorMiddleware };
