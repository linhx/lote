import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
expand(config(
  {
    path: process.env.NODE_ENV === 'development' ? '.env.dev' : undefined
  }
));
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from './Logger';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const logger =
    process.env.NODE_ENV === 'development' ? console : new Logger();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(','),
      credentials: true,
    },
    logger,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
