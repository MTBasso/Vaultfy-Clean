import { Router } from 'express';

import { CreateVaultController } from '../../../../modules/vault/useCases/createVault/CreateVaultController';
import { FetchVaultController } from '../../../../modules/vault/useCases/fetchVault/FetchVaultController';
import { authenticateToken } from '../middleware/authMiddleware';

const vaultRoutes = Router();

const createVaultController = new CreateVaultController();
const fetchVaultController = new FetchVaultController();

vaultRoutes.post('/register', authenticateToken, createVaultController.handle);
vaultRoutes.get('/fetch/:id', authenticateToken, fetchVaultController.handle);

export { vaultRoutes };
