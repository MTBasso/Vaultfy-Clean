import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';

import { router } from './routes';

import '../../container';

const app = express();
const port = 5000;

app.use(json());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
