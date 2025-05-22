import { IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  base64: string;
}
