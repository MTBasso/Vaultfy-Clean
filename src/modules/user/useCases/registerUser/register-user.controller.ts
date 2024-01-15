import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, ConflictError, InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { RegisterUserUseCase } from './register-user.usecase';

class RegisterUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password }: IUserDTO = req.body;
      if (!username || !email || !password) throw new BadRequestError('Missing fields in request');
      const registerUserUseCase = container.resolve(RegisterUserUseCase);
      const createdUser = await registerUserUseCase.execute({ username, email, password });
      if (!createdUser) throw new InternalServerError('Internal server error while creating the user');
      return res.status(201).json({ message: 'User Registered Successfully!', user: createdUser });
    } catch (error) {
      if (error instanceof InternalServerError || error instanceof ConflictError || error instanceof BadRequestError)
        throw error;
      throw new InternalServerError('Unhandled Internal Server Error');
    }
  }
}

export { RegisterUserController };
