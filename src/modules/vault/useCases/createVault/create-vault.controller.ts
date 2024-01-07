import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, UnauthorizedError } from '../../../../shared/errors/Error';
import { CreateVaultUseCase } from './create-vault.usecase';

class CreateVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const name: string = req.body.name;
    if (!name) throw new BadRequestError('Missing name in request');
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError('Unauthorized');
    const createVaultUseCase = container.resolve(CreateVaultUseCase);
    await createVaultUseCase.execute({ userId, name });
    return res.status(201).json({ message: 'Vault Created' });
  }
}

export { CreateVaultController };
