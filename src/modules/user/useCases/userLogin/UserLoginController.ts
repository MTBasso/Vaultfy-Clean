import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { UserLoginUseCase } from './UserLoginUseCase';

class UserLoginController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password }: IUserDTO = req.body;
    const loginUseCase = container.resolve(UserLoginUseCase);
    const token = await loginUseCase.execute({ email, password });
    if (!token) res.status(401).json({ message: 'Credentials Invalid' });
    res.cookie('token', token);
    return res.status(200).json({ message: 'Logged In', token: token });
  }
}

export { UserLoginController };