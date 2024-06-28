import { Request as ExpressRequest } from 'express';

export interface HttpAuthRequest extends ExpressRequest {
  authId?: string | '';
}
