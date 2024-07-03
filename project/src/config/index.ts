export const REDIS_URL = `redis://cache:${process.env.REDIS_PORT || '6379'}`;
export const ONE_TIME_PASS_EXPIRATION = 5 * 60000;
