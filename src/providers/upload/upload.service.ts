import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private r2Client: S3Client;
  constructor() {
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.STORAGE_URL,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async uploadBase64Image(base64: string): Promise<string> {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Formato base64 inválido');
    }

    const mimeType = matches[1];

    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Formato de imagem inválido');
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const fileExtension = mimeType.split('/')[1];
    const filename = `${uuid()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: filename,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    });

    await this.r2Client.send(command);

    return `${process.env.STORAGE_PUBLIC_URL}/${filename}`;
  }
}
