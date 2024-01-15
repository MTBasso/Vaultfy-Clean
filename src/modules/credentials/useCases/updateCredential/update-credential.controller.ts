import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, UnauthorizedError } from '../../../../shared/errors/Error';
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
    if (!service && !username && !password)
      throw new BadRequestError('At least one of the fields (service, username, password) is required for updating.');
    password = password ? encrypt(password, user.secret) : undefined;
    const updatedCredential = await updateCredentialUseCase.execute(id, { service, username, password });
    return res.status(200).json({ credential: updatedCredential });
  }
}

export { UpdateCredentialController };
