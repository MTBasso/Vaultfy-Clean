import { Router } from 'express';

import { ListUserVaultsController } from '../../../../modules/user/useCases/listUserVaults/list-user-vaults.controller';
import { RegisterUserController } from '../../../../modules/user/useCases/registerUser/register-user.controller';
import { UserLoginController } from '../../../../modules/user/useCases/userLogin/login-user.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const authRoutes = Router();

const registerUserController = new RegisterUserController();
const userLoginController = new UserLoginController();
const listUserVaultsController = new ListUserVaultsController();

authRoutes.post('/register', registerUserController.handle);
authRoutes.post('/login', userLoginController.handle);
authRoutes.get('/fetch', authenticateToken, listUserVaultsController.handle);

export { authRoutes };
