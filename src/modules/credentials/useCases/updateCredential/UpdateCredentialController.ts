import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { encrypt } from '../../../../utils/encryption';
import { UpdateCredentialUseCase } from './UpdateCredentialUseCase';

class UpdateCredentialController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCredentialUseCase = container.resolve(UpdateCredentialUseCase);
    const id = req.params.id;
    const { service, username } = req.body;
    let { password } = req.body;
    const user = req.user;
    if (!user) return res.status(500);
    password = encrypt(password, user.secret);
    const updatedCredential = await updateCredentialUseCase.execute(id, { service, username, password });
    return res.status(200).json({ message: 'Credential Updated', credential: updatedCredential });
  }
}

export { UpdateCredentialController };
