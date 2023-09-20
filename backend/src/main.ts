import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  const appPort = configService.get<number>('PORT');

  await app.listen(appPort);
}
bootstrap();
