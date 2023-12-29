import { Router } from 'express';

import { CreateCredentialController } from '../../../../modules/credentials/useCases/createCredential/CreateCredentialController';
import { DeleteCredentialController } from '../../../../modules/credentials/useCases/deleteCredential/DeleteCredentialController';
import { FetchCredentialController } from '../../../../modules/credentials/useCases/fetchCredential/FetchCredentialController';
import { UpdateCredentialController } from '../../../../modules/credentials/useCases/updateCredential/UpdateCredentialController';
import { authenticateToken } from '../middleware/authMiddleware';

const credentialRoutes = Router();

const createCredentialCrontroller = new CreateCredentialController();
const fetchCredentialController = new FetchCredentialController();
const updateCredentialController = new UpdateCredentialController();
const deleteCredentialController = new DeleteCredentialController();

credentialRoutes.post('/register', authenticateToken, createCredentialCrontroller.handle);
credentialRoutes.get('/fetch/:id', authenticateToken, fetchCredentialController.handle);
credentialRoutes.put('/update/:id', authenticateToken, updateCredentialController.handle);
credentialRoutes.delete('/delete/:id', authenticateToken, deleteCredentialController.handle);

export { credentialRoutes };
