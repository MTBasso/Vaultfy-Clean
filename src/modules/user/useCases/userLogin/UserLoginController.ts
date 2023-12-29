import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { UserLoginUseCase } from './UserLoginUseCase';

class UserLoginController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password }: IUserDTO = req.body;
    const loginUseCase = container.resolve(UserLoginUseCase);
    const token = await loginUseCase.execute({ email, password });
    res.cookie('token', token);
    console.log(req.cookies);
    return res.status(200).json({ message: 'Logged In', token: token });
  }
}

export { UserLoginController };
