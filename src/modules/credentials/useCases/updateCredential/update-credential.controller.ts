import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { encrypt } from '../../../../utils/encryption';
import { UpdateCredentialUseCase } from './update-credential.usecase';

class UpdateCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCredentialUseCase = container.resolve(UpdateCredentialUseCase);
    const id = req.params.id;
    const { service, username } = req.body;
    let { password } = req.body;
    const user = req.user;
    if (!user) throw new UnauthorizedError('Unauthorized');
    password = encrypt(password, user.secret);
    const updatedCredential = await updateCredentialUseCase.execute(id, { service, username, password });
    return res.status(200).json({ message: 'Credential Updated', credential: updatedCredential });
  }
}

export { UpdateCredentialController };
