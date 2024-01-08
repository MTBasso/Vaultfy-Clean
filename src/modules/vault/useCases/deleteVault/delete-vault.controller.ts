import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError } from '../../../../shared/errors/Error';
import { DeleteVaultUseCase } from './delete-vault.usecase';

class DeleteVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const deleteVaultUseCase = container.resolve(DeleteVaultUseCase);
      const id: string = req.params.id;
      if (!id) throw new BadRequestError('Missing id in request');
      await deleteVaultUseCase.execute(id);
      return res.status(200).json({
        message: 'Vault deleted successfully'
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { DeleteVaultController };
