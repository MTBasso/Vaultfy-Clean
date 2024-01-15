import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../../../../shared/errors/Error';
import { IUserAndVaultsDTO } from '../../infra/repositories/user.repository';
import { ListUserVaultsController } from './list-user-vaults.controller';
import { ListUserVaultsUseCase } from './list-user-vaults.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./list-user-vaults.usecase', () => ({
  ListUserVaultsUseCase: jest.fn()
}));

describe('list-user-vaults.controller', () => {
  let listUserVaultsController: ListUserVaultsController;
  let listUserVaultsUseCaseMock: jest.Mocked<ListUserVaultsUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    listUserVaultsUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ListUserVaultsUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(listUserVaultsUseCaseMock);
    listUserVaultsController = new ListUserVaultsController();
  });

  it('should fetch user vaults successfully and return JSON response', async () => {
    const mockedUser: IUserAndVaultsDTO = {
      id: 'testUserId',
      username: 'mockedUserUsername',
      email: 'mockeduser@email.com',
      vault: [
        { id: 'vault1', name: 'Vault 1' },
        { id: 'vault2', name: 'Vault 2' }
      ]
    };

    listUserVaultsUseCaseMock.execute.mockResolvedValueOnce(mockedUser);

    const mockRequest = {
      params: { id: mockedUser.id }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await listUserVaultsController.handle(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ userVaults: mockedUser });
  });

  it('should handle missing id in request and throw BadRequestError', async () => {
    const mockRequest = {
      params: { id: '' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await listUserVaultsController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle user not found and throw NotFoundError', async () => {
    listUserVaultsUseCaseMock.execute.mockRejectedValueOnce(new NotFoundError('User not found'));

    const mockRequest = {
      params: { id: 'testUserId' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await listUserVaultsController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
