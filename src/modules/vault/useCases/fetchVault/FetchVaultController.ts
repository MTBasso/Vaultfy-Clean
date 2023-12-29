import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { NotFoundError } from '../../../../shared/errors/Error';
import { FetchVaultUseCase } from './FetchVaultUseCase';

class FetchVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id: string = req.params.id;
    const fetchVaultUseCase = container.resolve(FetchVaultUseCase);
    const vault = await fetchVaultUseCase.execute(id);
    if (!vault) throw new NotFoundError('Vault not found');
    return res.status(200).json({ message: 'Vault Fetched Succesfully', vault: vault });
  }
}

export { FetchVaultController };
