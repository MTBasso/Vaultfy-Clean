import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { decrypt } from '../../../../utils/encryption';
import { FetchCredentialUseCase } from './FetchCredentialUseCase';

class FetchCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const fetchCredentialUseCase = container.resolve(FetchCredentialUseCase);
    const id: string = req.params.id;
    if (!id) return res.status(401).json({ error: 'Missing Id in request' });
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const credential = await fetchCredentialUseCase.execute(id);
    if (!credential) return res.status(404).json({ error: 'Credential Not Found' });
    const decryptedPassword = decrypt(credential.password, user.secret);
    return res.status(200).json({
      message: 'Credential fetched successfully',
      credential: {
        service: credential.service,
        username: credential.username,
        password: decryptedPassword
      }
    });
  }
}

export { FetchCredentialController };
