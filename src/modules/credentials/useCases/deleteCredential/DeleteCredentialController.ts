import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteCredentialUseCase } from './DeleteCredentialUseCase';

class DeleteCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteCredentialUseCase = container.resolve(DeleteCredentialUseCase);
    const id: string = req.params.id;
    if (!id) return res.status(401).json({ error: 'Missing Id in request' });
    await deleteCredentialUseCase.execute(id);
    return res.status(200).json({
      message: 'Credential deleted succesfully'
    });
  }
}

export { DeleteCredentialController };
