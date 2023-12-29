import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { RegisterUserUseCase } from './RegisterUserUseCase';

class RegisterUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { username, email, password }: IUserDTO = req.body;
    const registerUserUseCase = container.resolve(RegisterUserUseCase);
    const createdUser = await registerUserUseCase.execute({ username, email, password });
    return res.status(201).json({ message: 'User Registered Successfully!', user: createdUser });
  }
}

export { RegisterUserController };
