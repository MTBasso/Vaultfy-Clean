import { Router } from 'express';

import { CreateVaultController } from '../../../../modules/vault/useCases/createVault/create-vault.controller';
import { DeleteVaultController } from '../../../../modules/vault/useCases/deleteVault/delete-vault.controller';
import { FetchVaultController } from '../../../../modules/vault/useCases/fetchVault/fetch-vault.controller';
import { UpdateVaultController } from '../../../../modules/vault/useCases/updateVault/update-vault.controller';
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
