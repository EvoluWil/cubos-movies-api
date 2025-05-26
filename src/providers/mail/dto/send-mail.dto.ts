import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum MailTypeEnum {
  WELCOME = 'WELCOME',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  MOVIE_AVAILABLE = 'MOVIE_AVAILABLE',
}

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(MailTypeEnum)
  type: MailTypeEnum;

  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf((o) => o.type === MailTypeEnum.FORGOT_PASSWORD)
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ValidateIf((o) => o.type === MailTypeEnum.MOVIE_AVAILABLE)
  @IsString()
  @IsNotEmpty()
  movieTitle?: string;

  @ValidateIf((o) => o.type === MailTypeEnum.FORGOT_PASSWORD)
  @IsString()
  @IsNotEmpty()
  email?: string;
}
