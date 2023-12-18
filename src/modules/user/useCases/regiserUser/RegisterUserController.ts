import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { RegisterUserUseCase } from './RegiserUserUseCase';

class RegisterUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { username, email, password }: IUserDTO = req.body;
    const regiserUseCase = container.resolve(RegisterUserUseCase);
    await regiserUseCase.execute({ username, email, password });
    return res.status(201).json({ message: 'User Registered Successfully!' });
  }
}

export { RegisterUserController };
