import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { decrypt } from '../../../../utils/encryption';
import { FetchCredentialUseCase } from './fetch-credential.usecase';

class FetchCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const fetchCredentialUseCase = container.resolve(FetchCredentialUseCase);
    const id: string = req.params.id;
    const user = req.user;
    if (!user) throw new UnauthorizedError('Unauthorized');
    const credential = await fetchCredentialUseCase.execute(id);
    const decryptedPassword = decrypt(credential.password, user.secret);
    return res.status(200).json({
      credential: {
        service: credential.service,
        username: credential.username,
        password: decryptedPassword
      }
    });
  }
}

export { FetchCredentialController };
