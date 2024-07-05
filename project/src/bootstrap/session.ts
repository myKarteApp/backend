import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigProvider } from '@/config/config.provider';

export const setSession = (app: NestExpressApplication) => {
  app.use(
    session({
      secret: new ConfigProvider().SESSION_SECRET_KEY,
      // resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      },
    }),
  );
};
