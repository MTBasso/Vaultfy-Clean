import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateVaultController } from '../../../../modules/vault/useCases/createVault/CreateVaultController';
import { createVaultValidator } from '../../../../modules/vault/useCases/createVault/validator';
import { DeleteVaultController } from '../../../../modules/vault/useCases/deleteVault/DeleteVaultController';
import { deleteVaultValidator } from '../../../../modules/vault/useCases/deleteVault/validator';
import { FetchVaultController } from '../../../../modules/vault/useCases/fetchVault/FetchVaultController';
import { fetchVaultValidator } from '../../../../modules/vault/useCases/fetchVault/validator';
import { UpdateVaultController } from '../../../../modules/vault/useCases/updateVault/UpdateVaultController';
import {
  updateVaultBodyValidator,
  updateVaultParamsValidator
} from '../../../../modules/vault/useCases/updateVault/validator';
import { authenticateToken } from '../middleware/authMiddleware';

const vaultRoutes = Router();

const createVaultController = new CreateVaultController();
const fetchVaultController = new FetchVaultController();
const updateVaultController = new UpdateVaultController();
const deleteVaultController = new DeleteVaultController();

vaultRoutes.post('/register', celebrate(createVaultValidator), authenticateToken, createVaultController.handle);
vaultRoutes.get(
  '/fetch/:id',
  celebrate({ params: fetchVaultValidator }),
  authenticateToken,
  fetchVaultController.handle
);
vaultRoutes.put(
  '/update/:id',
  celebrate({ params: updateVaultParamsValidator, body: updateVaultBodyValidator }),
  authenticateToken,
  updateVaultController.handle
);
vaultRoutes.delete(
  '/delete/:id',
  celebrate({ params: deleteVaultValidator }),
  authenticateToken,
  deleteVaultController.handle
);

export { vaultRoutes };
