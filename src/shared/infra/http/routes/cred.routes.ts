import { Router } from 'express';

import { CreateCredentialController } from '../../../../modules/credentials/useCases/createCredential/CreateCredentialController';
import { FetchCredentialController } from '../../../../modules/credentials/useCases/fetchCredential/FetchCredentialController';
import { authenticateToken } from '../middleware/authMiddelware';

const credentialRoutes = Router();

const createCredentialCrontroller = new CreateCredentialController();
const fetchCredentialController = new FetchCredentialController();

credentialRoutes.post('/register', authenticateToken, createCredentialCrontroller.handle);
credentialRoutes.get('/fetch', authenticateToken, fetchCredentialController.handle);

export { credentialRoutes };
