import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateCredentialController } from '../../../../modules/credentials/useCases/createCredential/create-credential.controller';
import { createCredentialValidator } from '../../../../modules/credentials/useCases/createCredential/validator';
import { DeleteCredentialController } from '../../../../modules/credentials/useCases/deleteCredential/delete-credential.controller';
import { deleteCredentialValidator } from '../../../../modules/credentials/useCases/deleteCredential/validator';
import { FetchCredentialController } from '../../../../modules/credentials/useCases/fetchCredential/fetch-credential.controller';
import { fetchCredentialValidator } from '../../../../modules/credentials/useCases/fetchCredential/validator';
import { UpdateCredentialController } from '../../../../modules/credentials/useCases/updateCredential/update-credential.controller';
import {
  updateCredentialBodyValidator,
  updateCredentialParamsValidator
} from '../../../../modules/credentials/useCases/updateCredential/validator';
import { authenticateToken } from '../middleware/authMiddleware';

const credentialRoutes = Router();

const createCredentialCrontroller = new CreateCredentialController();
const fetchCredentialController = new FetchCredentialController();
const updateCredentialController = new UpdateCredentialController();
const deleteCredentialController = new DeleteCredentialController();

credentialRoutes.post(
  '/register',
  celebrate(createCredentialValidator),
  authenticateToken,
  createCredentialCrontroller.handle
);
credentialRoutes.get(
  '/fetch/:id',
  celebrate({ params: fetchCredentialValidator }),
  authenticateToken,
  fetchCredentialController.handle
);
credentialRoutes.put(
  '/update/:id',
  celebrate({ params: updateCredentialParamsValidator, body: updateCredentialBodyValidator }),
  authenticateToken,
  updateCredentialController.handle
);
credentialRoutes.delete(
  '/delete/:id',
  celebrate({ params: deleteCredentialValidator }),
  authenticateToken,
  deleteCredentialController.handle
);

export { credentialRoutes };
