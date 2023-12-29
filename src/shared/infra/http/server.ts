import 'express-async-errors';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';

import { errorMiddleware } from './middleware/errorMiddleware';
import { router } from './routes';

import '../../container';

const app = express();
const port = 5000;

app.use(json());
app.use(cookieParser());
app.use(router);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
