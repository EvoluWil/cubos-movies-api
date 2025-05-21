import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '4.5mb' }));
  app.use(bodyParser.urlencoded({ limit: '4.5mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: [process.env.CLIENT_URL],
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'X-Authorization',
      'X-Token-Auth',
      'Authorization',
    ],
    methods: 'GET, POST, PUT, DELETE',
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3333);
}

void bootstrap();
