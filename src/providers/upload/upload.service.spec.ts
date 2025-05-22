import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let sendMock: jest.Mock;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.STORAGE_URL = 'http://fake-url';
    process.env.STORAGE_ACCESS_KEY_ID = 'key';
    process.env.STORAGE_SECRET_ACCESS_KEY = 'secret';
    process.env.STORAGE_BUCKET = 'bucket';
    process.env.STORAGE_ACCOUNT_ID = 'account';

    sendMock = jest.fn().mockResolvedValue({});
    jest.spyOn(S3Client.prototype, 'send').mockImplementation(sendMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();
    service = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = { ...OLD_ENV };
  });

  it('should upload a valid base64 image and return the URL', async () => {
    const base64 = 'data:image/png;base64,aGVsbG8=';
    const url = await service.uploadBase64Image(base64);
    expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(url).toBe(
      'https://bucket.account.r2.cloudflarestorage.com/mock-uuid.png',
    );
  });

  it('should throw if base64 is invalid', async () => {
    await expect(service.uploadBase64Image('invalid')).rejects.toThrow(
      'Formato base64 inválido',
    );
  });

  it('should throw if not an image', async () => {
    const base64 = 'data:application/pdf;base64,aGVsbG8=';
    await expect(service.uploadBase64Image(base64)).rejects.toThrow(
      'Apenas imagens são permitidas',
    );
  });
});
