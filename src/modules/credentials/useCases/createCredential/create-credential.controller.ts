import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { encrypt } from '../../../../utils/encryption';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { CreateCredentialUseCase } from './create-credential.usecase';

class CreateCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { vaultId, service, username }: ICredentialDTO = req.body;
    let { password }: ICredentialDTO = req.body;
    const user = req.user;
    if (!user) throw new UnauthorizedError('Unauthorized');
    password = encrypt(password, user.secret);
    const createCredentialUseCase = container.resolve(CreateCredentialUseCase);
    const createdCreadential = await createCredentialUseCase.execute({ vaultId, service, username, password });
    return res.status(201).json({ credential: createdCreadential });
  }
}

export { CreateCredentialController };
