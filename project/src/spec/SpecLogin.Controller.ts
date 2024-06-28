import { DefaultAuthDto } from '@/shared/dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

export interface SpecLoginController {
  login(dto: DefaultAuthDto, response: ExpressResponse): Promise<void>;
  logout(request: ExpressRequest, response: ExpressResponse): Promise<void>;
}
