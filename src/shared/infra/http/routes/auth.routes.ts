import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ListUserVaultsController } from '../../../../modules/user/useCases/listUserVaults/list-user-vaults.controller';
import { listUserVaultsValidator } from '../../../../modules/user/useCases/listUserVaults/validator';
import { RegisterUserController } from '../../../../modules/user/useCases/registerUser/register-user.controller';
import { registerValidator } from '../../../../modules/user/useCases/registerUser/validator';
import { UserLoginController } from '../../../../modules/user/useCases/userLogin/login-user.controller';
import { loginValidator } from '../../../../modules/user/useCases/userLogin/validator';
import { authenticateToken } from '../middleware/authMiddleware';

const authRoutes = Router();

const registerUserController = new RegisterUserController();
const userLoginController = new UserLoginController();
const listUserVaultsController = new ListUserVaultsController();

authRoutes.post('/register', celebrate(registerValidator), registerUserController.handle);
authRoutes.post('/login', celebrate(loginValidator), userLoginController.handle);
authRoutes.get(
  '/fetch/:id',
  celebrate({ params: listUserVaultsValidator }),
  authenticateToken,
  listUserVaultsController.handle
);

export { authRoutes };
