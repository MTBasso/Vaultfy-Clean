import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InternalServerError } from '../../../../shared/errors/Error';
import { IVaultDTO } from '../../infra/entities/vault.entity';
import { CreateVaultController } from './create-vault.controller';
import { CreateVaultUseCase } from './create-vault.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./create-vault.usecase', () => ({
  CreateVaultUseCase: jest.fn()
}));

describe('create-vault.controller', () => {
  let createVaultController: CreateVaultController;
  let createVaultUseCaseMock: jest.Mocked<CreateVaultUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    createVaultUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateVaultUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(createVaultUseCaseMock);
    createVaultController = new CreateVaultController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle registration successfully and return JSON response', async () => {
    const mockVaultData: IVaultDTO = { userId: 'testUserId', name: 'testVaultName' };
    const createVaultUseCaseMock = container.resolve(CreateVaultUseCase) as jest.Mocked<CreateVaultUseCase>;
    jest.spyOn(container, 'resolve').mockReturnValueOnce(createVaultUseCaseMock);
    createVaultUseCaseMock.execute.mockResolvedValueOnce(mockVaultData);

    const mockRequest = {
      body: { name: mockVaultData.name },
      user: { id: mockVaultData.userId }
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await createVaultController.handle(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vault Created' });
  });

  it('should handle vault creation error and throw InternalServerError', async () => {
    const mockVaultData: IVaultDTO = { userId: 'testUserId', name: 'testVaultName' };
    createVaultUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      body: { name: mockVaultData.name },
      user: { id: mockVaultData.userId }
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await createVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(201);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
