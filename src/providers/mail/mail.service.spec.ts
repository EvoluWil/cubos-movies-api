import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { MailTypeEnum } from './dto/send-mail.dto';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-id' });
    jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: sendMailMock,
    } as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send welcome email', async () => {
    const dto = {
      to: 'test@example.com',
      subject: 'Welcome',
      type: MailTypeEnum.WELCOME,
      username: 'TestUser',
    };
    const result = await service.sendMail(dto);
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('test-id');
  });

  it('should send forgot password email', async () => {
    const dto = {
      to: 'test@example.com',
      subject: 'Forgot',
      type: MailTypeEnum.FORGOT_PASSWORD,
      username: 'TestUser',
      token: 'token123',
    };
    const result = await service.sendMail(dto);
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('test-id');
  });

  it('should send delete account email', async () => {
    const dto = {
      to: 'test@example.com',
      subject: 'Delete',
      type: MailTypeEnum.DELETE_ACCOUNT,
      username: 'TestUser',
    };
    const result = await service.sendMail(dto);
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('test-id');
  });

  it('should send movie available email', async () => {
    const dto = {
      to: 'test@example.com',
      subject: 'Movie',
      type: MailTypeEnum.MOVIE_AVAILABLE,
      username: 'TestUser',
      movieTitle: 'MovieX',
    };
    const result = await service.sendMail(dto);
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('test-id');
  });

  it('should return null messageId on error', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('fail'));
    const dto = {
      to: 'test@example.com',
      subject: 'Welcome',
      type: MailTypeEnum.WELCOME,
      username: 'TestUser',
    };
    const result = await service.sendMail(dto);
    expect(result.messageId).toBeNull();
  });
});
