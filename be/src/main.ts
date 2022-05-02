import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
dotenvExpand(config());
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from './Logger';

async function bootstrap() {
  const logger = process.env.NODE_ENV === 'development' ? console : new Logger();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(','),
      credentials: true,
    },
    logger
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
