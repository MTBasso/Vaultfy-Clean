import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { FetchCredentialController } from './fetch-credential.controller';
import { FetchCredentialUseCase } from './fetch-credential.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./fetch-credential.usecase', () => ({
  FetchCredentialUseCase: jest.fn()
}));

// Mocking decrypt function
jest.mock('../../../../utils/encryption', () => ({
  decrypt: jest.fn((encryptedPassword: string, secret: string) => 'DecryptedPassword')
}));

describe('fetch-credential.controller', () => {
  let fetchCredentialController: FetchCredentialController;
  let fetchCredentialUseCaseMock: jest.Mocked<FetchCredentialUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchCredentialUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<FetchCredentialUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(fetchCredentialUseCaseMock);
    fetchCredentialController = new FetchCredentialController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle fetching a credential successfully and return JSON response', async () => {
    const mockCredentialId = 'mockedCredentialId';
    const mockCredential: ICredentialDTO = {
      id: mockCredentialId,
      vaultId: 'mockedVaultId',
      service: 'Mocked Service',
      username: 'Mocked Username',
      password: 'EncryptedPassword'
    };

    fetchCredentialUseCaseMock.execute.mockResolvedValueOnce(mockCredential);

    const mockRequest = {
      params: { id: mockCredentialId },
      user: { id: 'testUserId', secret: 'testSecret' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await fetchCredentialController.handle(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      credential: {
        service: mockCredential.service,
        username: mockCredential.username,
        password: 'DecryptedPassword'
      }
    });
  });

  it('should handle unauthorized error and throw UnauthorizedError', async () => {
    fetchCredentialUseCaseMock.execute.mockRejectedValueOnce(new UnauthorizedError('Unauthorized'));

    const mockRequest = {
      params: { id: 'mockedCredentialId' },
      user: undefined
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await fetchCredentialController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
