import { celebrate } from 'celebrate';
import { Router } from 'express';

import { RegisterUserController } from '../../../../modules/user/useCases/registerUser/RegisterUserController';
import { registerValidator } from '../../../../modules/user/useCases/registerUser/validator';
import { UserLoginController } from '../../../../modules/user/useCases/userLogin/UserLoginController';
import { loginValidator } from '../../../../modules/user/useCases/userLogin/validator';

const authRoutes = Router();

const registerUserController = new RegisterUserController();
const userLoginController = new UserLoginController();

authRoutes.post('/register', celebrate(registerValidator), registerUserController.handle);
authRoutes.post('/login', celebrate(loginValidator), userLoginController.handle);

export { authRoutes };
