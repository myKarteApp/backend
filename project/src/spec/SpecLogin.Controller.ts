import { LoginDefaultAuthDto } from '@/shared/dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

export interface SpecLoginController {
  login(dto: LoginDefaultAuthDto, response: ExpressResponse): Promise<void>;
  logout(request: ExpressRequest, response: ExpressResponse): Promise<void>;
}
