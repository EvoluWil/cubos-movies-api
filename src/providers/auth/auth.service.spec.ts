/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MailTypeEnum } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'user-id',
  email: 'user@example.com',
  password: 'hashed-password',
  name: 'Test User',
  codeCreatedAt: new Date(),
  updatePasswordToken: 'reset-token',
  updatePasswordTokenCreatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let mail: MailService;

  beforeAll(() => {
    process.env.CRYPTO_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({ messageId: '123' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    mail = module.get<MailService>(MailService);
  });

  it('should sign in successfully', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...mockUser,
      userCredential: { password: mockUser.password },
    } as any);
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

    const result = await service.signIn({
      email: mockUser.email,
      password: '123',
    });
    expect(result.token).toBe('jwt-token');
    expect(result.user.email).toBe(mockUser.email);
  });

  it('should throw on wrong sign in credentials', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    await expect(
      service.signIn({ email: 'wrong', password: '123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw on wrong password', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...mockUser,
      userCredential: { password: mockUser.password },
    } as any);
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
    await expect(
      service.signIn({ email: mockUser.email, password: 'wrong' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should sign up and send welcome email', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.user, 'create').mockResolvedValue({} as any);
    const result = await service.signUp({
      profile: { name: 'John Doe', email: 'john@example.com' },
      credentials: { password: '123456', passwordConfirmation: '123456' },
    });
    const sendMailMock = (mail as any).sendMail;
    expect(result.ok).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: MailTypeEnum.WELCOME }),
    );
  });

  it('should throw if email already exists on sign up', async () => {
    jest
      .spyOn(prisma.user, 'findFirst')
      .mockResolvedValue({ email: 'existing@example.com' } as any);
    await expect(
      service.signUp({
        profile: { name: 'Test', email: 'existing@example.com' },
        credentials: { password: '123', passwordConfirmation: '123' },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should send forgot password email and store code', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser as any);
    jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);
    const result = await service.forgotPassword({ email: mockUser.email });
    const sendMailMock = (mail as any).sendMail;
    expect(result.ok).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: MailTypeEnum.FORGOT_PASSWORD }),
    );
  });

  it('should throw if user not found on forgot password', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    await expect(
      service.forgotPassword({ email: 'unknown@example.com' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should validate code and generate reset token', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser as any);
    jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);
    const result = await service.validateCode('123456', {
      email: mockUser.email,
    });
    expect(result.token).toBeDefined();
  });

  it('should reset password with valid token', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser as any);
    jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);
    const result = await service.resetPassword('reset-token', {
      password: 'newpass',
      passwordConfirmation: 'newpass',
    });
    expect(result.ok).toBe(true);
  });

  it('should delete account and send email', async () => {
    jest.spyOn(service, 'signIn').mockResolvedValue({
      user: mockUser,
      token: 'jwt-token',
    } as any);
    jest.spyOn(prisma.user, 'delete').mockResolvedValue({} as any);
    const result = await service.deleteAccount({
      email: mockUser.email,
      password: '123',
    });
    const sendMailMock = (mail as any).sendMail;
    expect(result.ok).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: MailTypeEnum.DELETE_ACCOUNT }),
    );
  });
});
