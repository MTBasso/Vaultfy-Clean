import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, ConflictError, InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { UserLoginUseCase } from './login-user.usecase';

class UserLoginController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password }: IUserDTO = req.body;
      const loginUseCase = container.resolve(UserLoginUseCase);
      const token = await loginUseCase.execute({ email, password });
      return res.status(200).json({ token: token });
    } catch (error) {
      if (error instanceof (BadRequestError || InternalServerError || ConflictError)) throw error;
      throw new InternalServerError('Unhandled Internal Server Error');
    }
  }
}

export { UserLoginController };
