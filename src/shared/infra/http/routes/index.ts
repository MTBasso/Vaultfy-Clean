import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { credentialRoutes } from './cred.routes';
import { vaultRoutes } from './vault.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vault', vaultRoutes);
router.use('/credential', credentialRoutes);

export { router };
