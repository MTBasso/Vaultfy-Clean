import { Router } from 'express';

import { RegisterUserController } from '../../../../modules/user/useCases/regiserUser/RegisterUserController';

const registerRoutes = Router();

const registerUserController = new RegisterUserController();

registerRoutes.post('/', registerUserController.handle);

export { registerRoutes };
