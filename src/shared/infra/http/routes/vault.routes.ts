import { Router } from 'express';

import { CreateVaultController } from '../../../../modules/vault/useCases/createVault/CreateVaultController';
import { authenticateToken } from '../middleware/authMiddelware';

const vaultRoutes = Router();

const createVaultController = new CreateVaultController();

vaultRoutes.post('/register', authenticateToken, createVaultController.handle);

export { vaultRoutes };
