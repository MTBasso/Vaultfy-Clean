import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError } from '../../../../shared/errors/Error';
import { UpdateVaultUseCase } from './update-vault.usecase';

class UpdateVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatedVaultUseCase = container.resolve(UpdateVaultUseCase);
    const id = req.params.id;
    const { name } = req.body;
    if (!id || !name) throw new BadRequestError('Missing fields in request');
    const updatedVault = await updatedVaultUseCase.execute(id, name);
    return res.status(200).json({
      updatedVault
    });
  }
}

export { UpdateVaultController };
