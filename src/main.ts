import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const loggerLevel =
    process.env.NODE_ENV === 'prod'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevel as any,
  });
  const port = process.env.PORT;

  await app.listen(port);
  logger.log(
    `Application is running on NODE_ENV:${process.env.NODE_ENV} PORT:${port}`,
  );
}
bootstrap();
