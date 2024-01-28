import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, json } from 'express';

import { ApiError } from '../../errors/Error';
import { router } from './routes';

import '../../container';

const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(cookieParser());
app.use(cors());
app.use(router);
app.use((err: Error, req: Request, res: Response) => {
  if (err instanceof ApiError) {
    const statusCode = err.statusCode;
    return res.status(statusCode).json({
      status: err.name,
      message: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
