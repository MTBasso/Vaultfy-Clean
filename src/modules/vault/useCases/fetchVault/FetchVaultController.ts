import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FetchVaultUseCase } from './FetchVaultUseCase';

class FetchVaultController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id: string = req.params.id;
    const fetchVaultUseCase = container.resolve(FetchVaultUseCase);
    const vault = await fetchVaultUseCase.execute(id);
    if (!vault) return res.status(401).json({ message: 'Vault not Found' });
    return res.status(200).json({ message: 'Vault Fetched Succesfully', vault: vault });
  }
}

export { FetchVaultController };
