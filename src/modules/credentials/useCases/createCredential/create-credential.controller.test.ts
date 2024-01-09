import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { CreateCredentialController } from './create-credential.controller';
import { CreateCredentialUseCase } from './create-credential.usecase';

jest.mock('./create-credential.usecase', () => ({
  CreateCredentialUseCase: jest.fn()
}));

describe('create-credential.controller', () => {
  let createCredentialController: CreateCredentialController;
  let createCredentialUseCaseMock: jest.Mocked<CreateCredentialUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    createCredentialUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateCredentialUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(createCredentialUseCaseMock);
    createCredentialController = new CreateCredentialController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle credential creation successfully and return JSON response', async () => {
    const mockCredentialData = {
      vaultId: 'testVaultId',
      service: 'testService',
      username: 'testUsername',
      password: 'testPassword'
    };
    createCredentialUseCaseMock.execute.mockResolvedValueOnce(mockCredentialData);

    const mockRequest = {
      body: mockCredentialData,
      user: { id: 'testUserId', secret: 'testSecret' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await createCredentialController.handle(mockRequest, mockResponse);

    expect(createCredentialUseCaseMock.execute).toHaveBeenCalledWith(mockCredentialData);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Credential Created',
      credential: mockCredentialData
    });
  });

  it('should handle unauthorized error and throw UnauthorizedError', async () => {
    const mockCredentialData = {
      vaultId: 'testVaultId',
      service: 'testService',
      username: 'testUsername',
      password: 'testPassword'
    };
    createCredentialUseCaseMock.execute.mockResolvedValueOnce(mockCredentialData);

    const mockRequest = {
      body: mockCredentialData,
      user: { id: 'testUserId', secret: 'testSecret' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await expect(createCredentialController.handle(mockRequest, mockResponse)).rejects.toThrow(UnauthorizedError);
    expect(createCredentialUseCaseMock.execute).not.toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalledWith(201);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
