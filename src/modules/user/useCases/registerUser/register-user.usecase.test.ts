import { container } from 'tsyringe';

import { ConflictError, InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { IUserRepository } from '../../infra/repositories/user.repository.interface';
import { RegisterUserUseCase } from './register-user.usecase';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  register: jest.fn(),
  login: jest.fn()
};

container.register<IUserRepository>('UserRepository', { useValue: mockUserRepository });

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    registerUserUseCase = container.resolve(RegisterUserUseCase);
  });

  it('should register a user successfully', async () => {
    const userData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    mockUserRepository.register.mockResolvedValueOnce(userData);

    const result = await registerUserUseCase.execute(userData);

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
    expect(result).toEqual(userData);
  });

  it('should throw ConflictError for duplicate email registration', async () => {
    // Mocking repository behavior to simulate a conflict (user with duplicate email)
    const userData: IUserDTO = { username: 'existingUser', email: 'existing@example.com', password: 'testPassword' };
    mockUserRepository.register.mockRejectedValueOnce(new ConflictError('User with this email already exists'));

    try {
      await registerUserUseCase.execute(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictError);
      if (error instanceof ConflictError) {
        expect(error.message).toBe('User with this email already exists');
      }
    }

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
  });

  it('should throw InternalServerError for general registration error', async () => {
    // Mocking repository behavior to simulate a general registration error
    const userData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    mockUserRepository.register.mockRejectedValueOnce(new InternalServerError('Error while creating the user'));

    try {
      await registerUserUseCase.execute(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      if (error instanceof InternalServerError) {
        expect(error.message).toBe('Error while creating the user');
      }
    }

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
  });
});
