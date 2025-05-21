import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ id: 'user-id' }),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();
    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  function mockContext(token?: string) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: token ? { authorization: `Bearer ${token}` } : {},
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  }

  it('should allow valid token', async () => {
    const context = mockContext('valid-token');
    const verifyAsyncMock = (jwtService as any).verifyAsync;
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verifyAsyncMock).toHaveBeenCalledWith('valid-token');
  });

  it('should throw if no token and not public', async () => {
    const context = mockContext();
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow if public route and no token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = mockContext();
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw if token invalid and not public', async () => {
    const verifyAsyncMock = (jwtService as any).verifyAsync as jest.Mock;
    verifyAsyncMock.mockRejectedValueOnce(new Error('invalid'));
    const context = mockContext('bad-token');
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow if token invalid but route is public', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const verifyAsyncMock = (jwtService as any).verifyAsync as jest.Mock;
    verifyAsyncMock.mockRejectedValueOnce(new Error('invalid'));
    const context = mockContext('bad-token');
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
