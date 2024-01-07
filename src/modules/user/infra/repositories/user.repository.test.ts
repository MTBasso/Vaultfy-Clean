import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from '../../../../shared/errors/Error';
import * as prismaModule from '../../../../shared/infra/prisma/prismaClient';
import * as encryptionModule from '../../../../utils/encryption';
import { IUserDTO } from '../entities/user.entity';
import { UserRepository } from './user.repository';

jest.mock('../../../../shared/infra/prisma/prismaClient', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

jest.mock('../../../../utils/encryption', () => ({
  ...jest.requireActual('../../../../utils/encryption'),
  hashString: jest.fn(),
  generateSecret: jest.fn(),
  compareHash: jest.fn()
}));

describe('UserRepository', () => {
  const userRepository = new UserRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    const mockCreatedUser = {
      id: '1',
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      secret: 'testSecret'
    };
    (prismaModule.prisma.user.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

    (encryptionModule.hashString as jest.Mock).mockResolvedValueOnce(mockCreatedUser.password);
    (encryptionModule.generateSecret as jest.Mock).mockReturnValueOnce(mockCreatedUser.secret);

    const userData = { username: mockCreatedUser.username, email: mockCreatedUser.email, password: 'testPassword' };
    const result = await userRepository.register(userData);

    expect(prismaModule.prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: mockCreatedUser.username,
        email: mockCreatedUser.email,
        password: mockCreatedUser.password,
        secret: mockCreatedUser.secret
      }
    });
    expect(result).toEqual(mockCreatedUser);
  });

  it('should throw BadRequestError for missing fields in registration', async () => {
    const userData = { username: 'testUser' }; // Missing email and password
    try {
      await userRepository.register(userData as IUserDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      if (error instanceof BadRequestError) {
        expect(error.message).toBe('Missing fields in request');
      }
    }
    // Ensure that prisma.user.create was not called in this case
    expect(prismaModule.prisma.user.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictError for duplicate email registration', async () => {
    // Mocking Prisma behavior to simulate a user with the provided email already exists
    (prismaModule.prisma.user.create as jest.Mock).mockResolvedValueOnce({ email: 'user@Bassola.com' });

    (encryptionModule.hashString as jest.Mock).mockResolvedValueOnce('hashedPassword');
    (encryptionModule.generateSecret as jest.Mock).mockReturnValueOnce('testSecret');

    const userData = { username: 'existingUser', email: 'user@Bassola.com', password: 'testPassword' };

    try {
      await userRepository.register(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictError);
      if (error instanceof ConflictError) {
        expect(error.message).toBe('User with this email already exists');
      }
    }

    expect(prismaModule.prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: userData.username,
        email: userData.email,
        password: 'hashedPassword',
        secret: 'testSecret'
      }
    });
  });

  it('should throw InternalServerError for general registration error', async () => {
    // Mocking Prisma behavior to simulate a general registration error
    (prismaModule.prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error('Some unexpected error'));

    (encryptionModule.hashString as jest.Mock).mockResolvedValueOnce('hashedPassword');
    (encryptionModule.generateSecret as jest.Mock).mockReturnValueOnce('testSecret');

    const userData = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };

    try {
      await userRepository.register(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      if (error instanceof InternalServerError) {
        expect(error.message).toBe('Error while creating the user');
      }
    }

    expect(prismaModule.prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: userData.username,
        email: userData.email,
        password: 'hashedPassword',
        secret: 'testSecret'
      }
    });
  });

  it('should login a user successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      secret: 'testSecret'
    };
    (prismaModule.prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    (encryptionModule.compareHash as jest.Mock).mockResolvedValueOnce(true);

    const loginData = { email: mockUser.email, password: 'testPassword' }; // Input
    const result = await userRepository.login(loginData);

    expect(prismaModule.prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginData.email } });
    expect(encryptionModule.compareHash).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(result).toEqual(expect.any(String)); // Ensure that the result is a string (token) indicating a successful login
  });

  it('should throw NotFoundError for non-existing user', async () => {
    // Mocking Prisma behavior to simulate that the user with the provided email is not found
    (prismaModule.prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    (encryptionModule.compareHash as jest.Mock).mockResolvedValueOnce(true);

    const loginData = { email: 'nonexistent@example.com', password: 'testPassword' };

    try {
      await userRepository.login(loginData);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      if (error instanceof NotFoundError) {
        expect(error.message).toBe('User not found, this email is not in use yet');
      }
    }

    expect(prismaModule.prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginData.email } });
    // Ensure that the compareHash method was not called in this case
    expect(encryptionModule.compareHash).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError for incorrect password', async () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      secret: 'testSecret'
    };
    (prismaModule.prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    (encryptionModule.compareHash as jest.Mock).mockResolvedValueOnce(false);

    const loginData = { email: mockUser.email, password: 'incorrectPassword' }; // input

    try {
      await userRepository.login(loginData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe('Password is incorrect');
      }
    }

    expect(prismaModule.prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginData.email } });
    expect(encryptionModule.compareHash).toHaveBeenCalledWith(loginData.password, mockUser.password);
  });
});
