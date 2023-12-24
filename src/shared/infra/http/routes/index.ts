import { Router } from 'express';

import { registerRoutes } from './auth.routes';

const router = Router();

router.use('/auth', registerRoutes);

export { router };
