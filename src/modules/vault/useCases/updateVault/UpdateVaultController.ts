import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateVaultUseCase } from './UpdateVaultUseCase';

class UpdateVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatedVaultUseCase = container.resolve(UpdateVaultUseCase);
    const id = req.params.id;
    const { name } = req.body;
    await updatedVaultUseCase.execute(id, name);
    return res.status(200).json({ message: 'Vault Updated' });
  }
}

export { UpdateVaultController };
