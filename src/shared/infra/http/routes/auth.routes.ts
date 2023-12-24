import { Request, Response, Router } from 'express';

import { RegisterUserController } from '../../../../modules/user/useCases/registerUser/RegisterUserController';
import { UserLoginController } from '../../../../modules/user/useCases/userLogin/UserLoginController';
import { authenticateToken } from '../middleware/authMiddelware';

const registerRoutes = Router();

const registerUserController = new RegisterUserController();
const userLoginController = new UserLoginController();

registerRoutes.post('/register', registerUserController.handle);
registerRoutes.post('/login', userLoginController.handle);
registerRoutes.get('/test', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: `tested, here is the user id: ${req.user?.id}` });
});

export { registerRoutes };
