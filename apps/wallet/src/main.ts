import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService)

  const PORT = configService.get<number>('PORT') ?? 3000
  
  await app.listen(PORT);
}
bootstrap();
