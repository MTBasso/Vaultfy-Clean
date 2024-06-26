import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';
import { UpdateCredentialUseCase } from './update-credential.usecase';

const credentialRepositoryMock: jest.Mocked<ICredentialRepository> = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  register: jest.fn()
};

container.register<ICredentialRepository>('CredentialRepository', { useValue: credentialRepositoryMock });

describe('update-credential.usecase', () => {
  let updateCredentialUseCase: UpdateCredentialUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updateCredentialUseCase = container.resolve(UpdateCredentialUseCase);
  });

  it('should update an existing credential', async () => {
    const id = 'mockedCredentialId';
    const mockedCredential: ICredentialDTO = {
      service: 'Service',
      username: 'Username',
      password: 'Password'
    };

    credentialRepositoryMock.findByIdAndUpdate.mockResolvedValueOnce(mockedCredential);

    const result = await updateCredentialUseCase.execute(id, mockedCredential);

    expect(credentialRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(id, mockedCredential);
    expect(result).toEqual(mockedCredential);
  });

  it('should throw NotFoundError when credential not found', async () => {
    const id = 'nonExistentCredentialId';
    const updatedCredential: ICredentialDTO = {
      service: 'Updated Service',
      username: 'Updated Username',
      password: 'Updated Password'
    };

    credentialRepositoryMock.findById.mockRejectedValueOnce(new NotFoundError('Credential not found'));

    try {
      await updateCredentialUseCase.execute(id, updatedCredential);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('should throw BadRequestError when missing fields in request', async () => {
    try {
      await updateCredentialUseCase.execute('mockedCredentialId', {} as ICredentialDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw InternalServerError when repository fails', async () => {
    const id = 'mockedCredentialId';
    const updatedCredential: ICredentialDTO = {
      service: 'Updated Service',
      username: 'Updated Username',
      password: 'Updated Password'
    };

    credentialRepositoryMock.findById.mockResolvedValueOnce({} as ICredentialDTO);
    credentialRepositoryMock.findByIdAndUpdate.mockRejectedValueOnce(new InternalServerError('Repository Error'));

    await expect(updateCredentialUseCase.execute(id, updatedCredential)).rejects.toThrow(InternalServerError);
  });
});
