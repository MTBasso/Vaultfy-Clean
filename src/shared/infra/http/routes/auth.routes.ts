import { Request, Response, Router } from 'express';

import { RegisterUserController } from '../../../../modules/user/useCases/registerUser/RegisterUserController';
import { UserLoginController } from '../../../../modules/user/useCases/userLogin/UserLoginController';
import { authenticateToken } from '../middleware/authMiddleware';

const authRoutes = Router();

const registerUserController = new RegisterUserController();
const userLoginController = new UserLoginController();

authRoutes.post('/register', registerUserController.handle);
authRoutes.post('/login', userLoginController.handle);
authRoutes.get('/test', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: `tested, here is the user id: ${req.user?.id}` });
});

export { authRoutes };
