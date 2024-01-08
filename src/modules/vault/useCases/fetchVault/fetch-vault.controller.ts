import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { FetchVaultUseCase } from './fetch-vault.usecase';

class FetchVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const id: string = req.params.id;
      if (!id) throw new BadRequestError('Missing id in request');
      const fetchVaultUseCase = container.resolve(FetchVaultUseCase);
      const vault = await fetchVaultUseCase.execute(id);
      if (!vault || vault === null) throw new NotFoundError('Vault not found');
      return res.status(200).json({ message: 'Vault Fetched Succesfully', vault: vault });
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { FetchVaultController };
