import { Expose } from 'class-transformer';

export class FindUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  password: string;
}
