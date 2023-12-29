import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteVaultUseCase } from './DeleteVaultUseCase';

class DeleteVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteVaultUseCase = container.resolve(DeleteVaultUseCase);
    const id: string = req.params.id;
    if (!id) return res.status(500);
    await deleteVaultUseCase.execute(id);
    return res.status(200).json({
      message: 'Vault deleted succesfully'
    });
  }
}

export { DeleteVaultController };
