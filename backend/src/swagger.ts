// swagger.config.ts

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication) {
  const configService: ConfigService = app.get(ConfigService);

  const title = configService.get<string>('SWAGGER_TITLE', 'My NestJS App');
  const description = configService.get<string>(
    'SWAGGER_DESCRIPTION',
    'API Documentation for My NestJS App',
  );
  const version = configService.get<string>('SWAGGER_VERSION', '1.0');
  const route = configService.get<string>('SWAGGER_ROUTE', 'swagger');

  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(route, app, document);
}
