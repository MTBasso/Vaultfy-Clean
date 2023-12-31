import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, UnauthorizedError } from '../../../../shared/errors/Error';
import { CreateVaultUseCase } from './create-vault.usecase';

class CreateVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const name: string = req.body.name;
      if (!name) throw new BadRequestError('Missing name in request');
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('Unauthorized');
      const createVaultUseCase = container.resolve(CreateVaultUseCase);
      await createVaultUseCase.execute({ userId, name });
      return res.status(201).json({ message: 'Vault Created' });
    } catch (error) {
      if (error instanceof (BadRequestError || UnauthorizedError)) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { CreateVaultController };
