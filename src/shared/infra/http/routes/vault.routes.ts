import { Router } from 'express';

import { CreateVaultController } from '../../../../modules/vault/useCases/createVault/CreateVaultController';
import { DeleteVaultController } from '../../../../modules/vault/useCases/deleteVault/DeleteVaultController';
import { FetchVaultController } from '../../../../modules/vault/useCases/fetchVault/FetchVaultController';
import { UpdateVaultController } from '../../../../modules/vault/useCases/updateVault/UpdateVaultController';
import { authenticateToken } from '../middleware/authMiddleware';

const vaultRoutes = Router();

const createVaultController = new CreateVaultController();
const fetchVaultController = new FetchVaultController();
const updateVaultController = new UpdateVaultController();
const deleteVaultController = new DeleteVaultController();

vaultRoutes.post('/register', authenticateToken, createVaultController.handle);
vaultRoutes.get('/fetch/:id', authenticateToken, fetchVaultController.handle);
vaultRoutes.put('/update/:id', authenticateToken, updateVaultController.handle);
vaultRoutes.delete('/delete/:id', authenticateToken, deleteVaultController.handle);

export { vaultRoutes };
