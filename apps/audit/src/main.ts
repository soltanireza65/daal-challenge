import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';
import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuditModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUDIT'));
  await app.startAllMicroservices();

  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('PORT') ?? 3001

  await app.listen(PORT);
}
bootstrap();
