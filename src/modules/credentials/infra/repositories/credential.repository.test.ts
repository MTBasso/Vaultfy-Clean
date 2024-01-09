/* eslint-disable @typescript-eslint/require-await */
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import * as prismaModule from '../../../../shared/infra/prisma/prismaClient';
import { ICredentialDTO } from '../entities/credential.entity';
import { CredentialRepository } from './credential.repository';

jest.mock('../../../../shared/infra/prisma/prismaClient', () => ({
  prisma: {
    credential: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

describe('CredentialRepository', () => {
  const credentialRepository = new CredentialRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a credential', async () => {
      const mockCreatedCredential = {
        id: 'mockedCredentialId',
        vaultId: 'mockedVaultId',
        service: 'Mocked Service',
        username: 'Mocked User',
        password: 'Mocked Password'
      };
      (prismaModule.prisma.credential.create as jest.Mock).mockResolvedValueOnce(mockCreatedCredential);
      const mockCredentialData = {
        vaultId: 'mockedVaultId',
        service: 'Mocked Service',
        username: 'Mocked User',
        password: 'Mocked Password'
      };
      const result = await credentialRepository.register(mockCredentialData);

      expect(prismaModule.prisma.credential.create).toHaveBeenCalledWith({ data: mockCredentialData });
      expect(result).toEqual({
        id: mockCreatedCredential.id,
        vaultId: mockCreatedCredential.vaultId,
        service: mockCreatedCredential.service,
        username: mockCreatedCredential.username,
        password: mockCreatedCredential.password
      });
    });

    it('should throw InternalServerError when Prisma create fails', async () => {
      (prismaModule.prisma.credential.create as jest.Mock).mockRejectedValueOnce(
        new InternalServerError('Unexpected Prisma error')
      );

      const mockCredentialData = {
        vaultId: 'mockedVaultId',
        service: 'Mocked Service',
        username: 'Mocked User',
        password: 'Mocked Password'
      };

      await expect(credentialRepository.register(mockCredentialData)).rejects.toThrow(InternalServerError);
    });
  });

  describe('findById', () => {
    it('should find a credential by its id', async () => {
      const mockCreatedCredential = {
        id: 'mockedCredentialId',
        vaultId: 'mockedVaultId',
        service: 'Mocked Service',
        username: 'Mocked User',
        password: 'Mocked Password'
      };

      (prismaModule.prisma.credential.findUnique as jest.Mock).mockResolvedValueOnce(mockCreatedCredential);

      const result = await credentialRepository.findById(mockCreatedCredential.id);

      expect(prismaModule.prisma.credential.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreatedCredential.id }
      });

      expect(result).toEqual({
        id: mockCreatedCredential.id,
        vaultId: mockCreatedCredential.vaultId,
        service: mockCreatedCredential.service,
        username: mockCreatedCredential.username,
        password: mockCreatedCredential.password
      });
    });

    it('should throw BadRequestError when missing id in request', async () => {
      await expect(credentialRepository.findById('')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when credential not found', async () => {
      (prismaModule.prisma.credential.findUnique as jest.Mock).mockResolvedValueOnce(null);

      try {
        await credentialRepository.findById('nonExistingId');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should find credential by id and update', async () => {
      const mockCreatedCredential = {
        id: 'mockedCredentialId',
        vaultId: 'mockedVaultId',
        service: 'Mocked Service',
        username: 'Mocked User',
        password: 'Mocked Password'
      };

      const updatedCredentialData = {
        service: 'Updated Service',
        username: 'Updated User',
        password: 'Updated Password'
      };

      (prismaModule.prisma.credential.findUnique as jest.Mock).mockResolvedValueOnce(mockCreatedCredential);
      (prismaModule.prisma.credential.update as jest.Mock).mockResolvedValueOnce({
        ...mockCreatedCredential,
        ...updatedCredentialData
      });

      const result = await credentialRepository.findByIdAndUpdate(mockCreatedCredential.id, updatedCredentialData);

      expect(prismaModule.prisma.credential.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreatedCredential.id }
      });

      expect(prismaModule.prisma.credential.update).toHaveBeenCalledWith({
        where: { id: mockCreatedCredential.id },
        data: updatedCredentialData
      });

      expect(result).toEqual({
        ...mockCreatedCredential,
        ...updatedCredentialData
      });
    });

    it('should throw BadRequestError when missing id in request', async () => {
      await expect(credentialRepository.findByIdAndUpdate('', {} as ICredentialDTO)).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when credential not found', async () => {
      (prismaModule.prisma.credential.update as jest.Mock).mockRejectedValueOnce(null);

      try {
        await credentialRepository.findByIdAndUpdate('1', {} as ICredentialDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('findByIdAndDelete', () => {
    it('should find credential by id and delete', async () => {
      const mockedCredentialId = 'mockedCredentialId';

      (prismaModule.prisma.credential.delete as jest.Mock).mockResolvedValueOnce({ id: mockedCredentialId });

      await credentialRepository.findByIdAndDelete(mockedCredentialId);

      expect(prismaModule.prisma.credential.delete).toHaveBeenCalledWith({ where: { id: mockedCredentialId } });
    });

    it('should throw BadRequestError when missin id in request', async () => {
      await expect(credentialRepository.findByIdAndDelete('')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when credential not found', async () => {
      (prismaModule.prisma.credential.delete as jest.Mock).mockResolvedValueOnce(null);

      try {
        await credentialRepository.findByIdAndDelete('nonExistentId');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
