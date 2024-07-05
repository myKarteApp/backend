import { NestExpressApplication } from '@nestjs/platform-express';

export const setViews = (app: NestExpressApplication) => {
  app.setViewEngine('hbs');
};
