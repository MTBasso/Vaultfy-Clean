import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { IUserAndVaultsDTO } from '../../infra/repositories/user.repository';
import { IUserRepository } from '../../infra/repositories/user.repository.interface';
import { ListUserVaultsUseCase } from './list-user-vaults.usecase';

const userRepositoryMock: jest.Mocked<IUserRepository> = {
  register: jest.fn(),
  login: jest.fn(),
  listVaults: jest.fn()
};

container.register<IUserRepository>('UserRepository', { useValue: userRepositoryMock });

describe('ListUserVaultsUseCase', () => {
  let listUserVaultsUseCase: ListUserVaultsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listUserVaultsUseCase = container.resolve(ListUserVaultsUseCase);
  });

  it('should successfully fetch the user vaults', async () => {
    const mockedUser: IUserAndVaultsDTO = {
      id: 'testUserId',
      username: 'mockedUserUsername',
      email: 'mockeduser@email.com',
      vault: [
        { id: 'vault1', name: 'Vault 1' },
        { id: 'vault2', name: 'Vault 2' }
      ]
    };

    userRepositoryMock.listVaults.mockResolvedValueOnce(mockedUser);

    const result = await listUserVaultsUseCase.execute(mockedUser.id);

    expect(userRepositoryMock.listVaults).toHaveBeenCalledWith(mockedUser.id);
    expect(result).toEqual(mockedUser);
  });

  it('should throw a BadRequestError when missing the Id in the request', async () => {
    try {
      await listUserVaultsUseCase.execute('');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw a NotFoundError when User vaults is not found', async () => {
    userRepositoryMock.listVaults.mockRejectedValueOnce(new NotFoundError('User not found'));

    await expect(listUserVaultsUseCase.execute('nonExistentuserId')).rejects.toThrow(NotFoundError);
  });

  it('should throw InternalServerError when repository fails', async () => {
    userRepositoryMock.listVaults.mockRejectedValueOnce(new InternalServerError('Some Error'));

    await expect(listUserVaultsUseCase.execute('testUserId')).rejects.toThrow(InternalServerError);
  });
});
