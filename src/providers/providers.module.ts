import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.modules';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    MailModule,
    JwtModule,
    AuthModule,
  ],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
