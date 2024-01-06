/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

import { User } from '../../../../../modules/user/infra/entities/user.entity';

declare global {
  namespace Express {
    export interface Request {
      user: User | null;
    }
  }
}
