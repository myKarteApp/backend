import { Controller, Get } from '@nestjs/common';

import * as crypto from 'crypto';

@Controller()
export class AppController {
  @Get()
  async getHello() {
    const privateKey = crypto.randomBytes(32).toString('base64');
    return { privateKey: privateKey };
    // let result;
    // try {
    //   result = await this.datasource.connect.authInfo.create({
    //     data: {
    //       authId: v4(),
    //       email: `${generateRandomString(10)}@example.com`,
    //       password: 'hashed_password',
    //       authType: 'default',
    //     },
    //   });
    //   console.log('Created AuthInfo:', result);
    // } catch (error) {
    //   console.error('Failed to create AuthInfo:', error);

    //   result = {
    //     message: 'error',
    //   };
    // } finally {
    //   await this.datasource.connect.$disconnect();
    // }
    // return result;
  }
}
