import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const logger = new Logger(); // Create an instance of Logger directly
  app.useLogger(logger);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}

bootstrap();
