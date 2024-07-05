import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigProvider } from '../config/config.provider';

export const setSwagger = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('API description')
    .setVersion('1.0')
    .addServer(`https://${new ConfigProvider().APP_DOMAIN}/api`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('_', app, document);
};
