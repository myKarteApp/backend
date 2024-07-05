// import { z } from 'zod';

import { AuthRole, AuthType } from '../enum';
import { Validator } from '../utils/error';

export type ResponseOK = {
  message: string;
};

export type DefaultAuthDto = {
  authId?: string; //作成時点ではnullでやってくる
  email: string;
  password: string;
  authType?: string;
  authRole?: string;
  identityConfirmed?: boolean;
  isTrial?: boolean;
};

export const validateDefaultAuthDto = (dto: DefaultAuthDto): Validator => {
  const validator = new Validator();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
    validator.pushError('email', 'emailを正しく入力しください。');
  if (Object.keys(dto.password).length < 8)
    validator.pushError('password', '8文字以上で記載してください。');

  if (dto.authType) {
    const authType = Object.keys(AuthType).filter((key) =>
      isNaN(Number(AuthType[key])),
    );
    if (!authType.includes(dto.authType))
      validator.pushError('authType', '認証形式が不正です。');
  }
  if (dto.authRole) {
    const authRole = Object.keys(AuthRole).filter((key) =>
      isNaN(Number(AuthRole[key])),
    );
    if (!authRole.includes(dto.authRole))
      validator.pushError('authRoles', '認可が不正です。');
  }
  return validator;
};
// // スキーマを定義
// export const DefaultAuthDto = z.object({
//   authId: z.string().nullable(),
//   email: z.string().email(),
//   password: z.string(),
//   authType: z.string().nullable(),
//   authRole: z.string().nullable(),
//   identityConfirmed: z.boolean(),
//   isTrial: z.boolean().nullable(),
// });

export type RegisterDto = {
  email: string;
  password: string;
  passCode: string;
  queryToken: string;
};

export const validateRegisterDto = (dto: Partial<RegisterDto>): Validator => {
  const validator = new Validator();
  const { email, password, passCode, queryToken } = dto;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ? email : ''))
    validator.pushError('email', 'emailを正しく入力しください。');
  if (Object.keys(password ? password : '').length < 8)
    validator.pushError(
      'password',
      'パスワードは8文字以上で記載してください。',
    );
  if (Object.keys(passCode ? passCode : '').length !== 6)
    validator.pushError(
      'passCode',
      'パスコードは6文字以上で記載してください。',
    );
  if (Object.keys(queryToken ? queryToken : '').length === 0)
    validator.pushError('queryToken', '不正な操作が行われました。');
  return validator;
};

export enum SexType {
  male = 'mail',
  female = 'female',
}

export type UserInfoDto = {
  userId?: string; //作成時点ではnullでやってくる
  authId: string;
  birthDay: Date;
  sex: SexType;
  gender: string;
  familyName: string;
  givenName: string;
  address: string;
  tel: string;
  profession: string;
  createdAt?: Date; //作成時点ではnullでやってくる
};

export type AccountInfoDto = Omit<
  DefaultAuthDto & UserInfoDto,
  'authId' | 'password'
>;
export type ClientInfoDto = Omit<AccountInfoDto, 'userId'> & {
  clientId: string;
};
export type JwsTokenSchema = {
  payload: {
    authId: string;
  };
  isExpired: boolean;
};

export type DefaultColumns = 'isDeleted' | 'createdAt' | 'updatedAt';
