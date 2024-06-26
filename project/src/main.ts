import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  console.log(process.env.TZ);
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.BACK_PORT) || 4000);
}
bootstrap();
