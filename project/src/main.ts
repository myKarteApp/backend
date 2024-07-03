import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('API description')
    .setVersion('1.0')
    // .setBasePath('api')
    .addServer('https://local.kokotest.com/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(Number(process.env.BACK_PORT) || 4000);
}
bootstrap();
