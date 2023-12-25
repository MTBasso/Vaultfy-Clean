import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IVaultDTO } from '../../infra/entities/Vault';
import { CreateVaultUseCase } from './CreateVaultUseCase';

class CreateVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name }: IVaultDTO = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'error' });
    const createVaultUseCase = container.resolve(CreateVaultUseCase);
    await createVaultUseCase.execute({ userId, name });
    return res.status(201).json({ message: 'Vault Created' });
  }
}

export { CreateVaultController };
