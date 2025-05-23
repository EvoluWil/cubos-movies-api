import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.modules';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    MailModule,
    JwtModule,
    AuthModule,
    WebhookModule,
  ],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
