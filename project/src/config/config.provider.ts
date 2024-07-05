import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ConfigProvider {
  get APP_DOMAIN(): string {
    return process.env.APP_DOMAIN || 'localhost';
  }
  get SESSION_SECRET_KEY(): string {
    return process.env.SESSION_SECRET_KEY || 'test';
  }
  get ONE_TIME_PASS_EXPIRATION(): number {
    return 5 * 60000;
  }
  get REDIS_URL(): string {
    return `redis://cache:${process.env.REDIS_PORT || '6379'}`;
  }
}
