import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
// import * as passport from 'passport';

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

  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY || 'test',
      // resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      },
    }),
  );
  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(Number(process.env.BACK_PORT) || 4000);
}
bootstrap();
