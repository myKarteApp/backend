import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthInfo } from '@prisma/client';
import { JwsTokenSchema } from '@/shared';

@Injectable()
export class JwsTokenProvider {
  constructor() {}
  private readonly privateKey = process.env.JWS_PRIVATE_KEY;
  private readonly jwsExpiresIn = '1h';

  public async createJwsToken(dto: AuthInfo): Promise<string> {
    return jwt.sign(
      {
        authId: dto.authId,
      },
      this.privateKey,
      { expiresIn: this.jwsExpiresIn },
    );
  }

  decryptJwsToken(token: string): JwsTokenSchema {
    const decodedToken = jwt.verify(token, this.privateKey);
    const expiresAt = new Date(decodedToken.exp * 1000);
    const currentDateTime = new Date();
    return {
      payload: decodedToken,
      isExpired: currentDateTime > expiresAt,
    };
  }
}
