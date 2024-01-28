import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { ListUserVaultsUseCase } from './list-user-vaults.usecase';

class ListUserVaultsController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const id: string | undefined = req.user?.id;
      if (!id || id === undefined) throw new BadRequestError('Missing Id in request');
      const listUserVaultsUseCase = container.resolve(ListUserVaultsUseCase);
      const userVaults = await listUserVaultsUseCase.execute(id);
      if (!userVaults || userVaults === null) throw new NotFoundError('User not found');
      return res.status(200).json({ userVaults });
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) throw error;
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { ListUserVaultsController };
