import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setSwagger } from './bootstrap/swagger';
import { setSession } from './bootstrap/session';
import { AppModule } from './bootstrap/app.module';
import { setViews } from './bootstrap/views';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setSwagger(app);
  setSession(app);
  setViews(app);
  await app.listen(Number(process.env.BACK_PORT) || 4000);
}
bootstrap();
