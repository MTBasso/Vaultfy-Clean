import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';
import { DeleteCredentialUseCase } from './delete-credential.usecase';

const credentialRepositoryMock: jest.Mocked<ICredentialRepository> = {
  register: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<ICredentialRepository>('CredentialRepository', { useValue: credentialRepositoryMock });

describe('delete-credential.usecase', () => {
  let deleteCredentialUseCase: DeleteCredentialUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteCredentialUseCase = container.resolve(DeleteCredentialUseCase);
  });

  it('should delete a credential', async () => {
    const credentialId = 'mockedCredentialId';

    await deleteCredentialUseCase.execute(credentialId);

    expect(credentialRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(credentialId);
  });

  it('should throw BadRequestError when missing id in request', async () => {
    const invalidCredentialId = '';

    try {
      await deleteCredentialUseCase.execute(invalidCredentialId);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw NotFoundError when credential not found', async () => {
    const nonExistingCredentialId = 'nonExistingId';
    credentialRepositoryMock.findByIdAndDelete.mockRejectedValueOnce(new NotFoundError('Credential not found'));

    await expect(deleteCredentialUseCase.execute(nonExistingCredentialId)).rejects.toThrow(NotFoundError);
  });

  it('should throw InternalServerError when repository fails', async () => {
    const credentialId = 'mockedCredentialId';
    credentialRepositoryMock.findByIdAndDelete.mockRejectedValueOnce(new InternalServerError('Repository Error'));

    await expect(deleteCredentialUseCase.execute(credentialId)).rejects.toThrow(InternalServerError);
  });
});
