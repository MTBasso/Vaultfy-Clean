import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { vaultRoutes } from './vault.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vault', vaultRoutes);

export { router };
