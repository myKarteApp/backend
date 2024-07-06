import { AuthRole, AuthType } from '../enum';
import { Validator, validateEmail, validatePassword } from '../utils/validator';
import { getEnumValue } from './utils';
export * from './utils';

// NOTE: 先頭アンバー付きがベースのtype。dtoはフロントとバックのインターフェース。
/*
  その他
*/
export type ResponseOK = {
  message: string;
};

export type DefaultColumns = 'isDeleted' | 'createdAt' | 'updatedAt';
export type AddDefaultColumns = {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ByColumns = {
  createdBy: string;
  updatedBy: string;
};

/* =======================
認証系
======================= */
export type _DefaultAuth = {
  authId: string;
  email: string;
  password: string;
  authType: AuthType;
  authRole: AuthRole;
  isVerify: boolean;
  isTrial: boolean;
};

export type CreateDefaultAuthDto = {
  email: string;
  password: string;
};

export type LoginDefaultAuthDto = CreateDefaultAuthDto;

export const validateDefaultAuth = (
  dto: Partial<CreateDefaultAuthDto | LoginDefaultAuthDto>,
): Validator => {
  const validator = new Validator();
  validateEmail(validator, dto.email);
  validatePassword(validator, dto.password);
  return validator;
};

export type RegisterDto = {
  email: string;
  password: string;
  passCode: string;
  queryToken: string;
};

export const validateRegisterDto = (dto: Partial<RegisterDto>): Validator => {
  const validator = new Validator();
  const { passCode, queryToken } = dto;
  validateEmail(validator, dto.email);
  validatePassword(validator, dto.password);
  if (Object.keys(passCode ? passCode : '').length !== 6)
    validator.pushError(
      'passCode',
      'パスコードは6文字以上で記載してください。',
    );
  if (Object.keys(queryToken ? queryToken : '').length === 0)
    validator.pushError('queryToken', '不正な操作が行われました。');
  return validator;
};

/* =======================
ユーザー情報系
======================= */
export enum SexType {
  male = 'male',
  female = 'female',
}

export type _UserInfo = {
  userId: string;
  authId: string;
  birthDay: Date;
  sex: SexType;
  gender: string;
  familyName: string;
  givenName: string;
  address: string;
  tel: string;
  profession: string;
  createdAt: Date;
};

export type CreateUserInfoDto = Omit<
  _UserInfo,
  'userId' | 'authId' | 'createdAt'
>;

export type UserIdListDto = {
  userIdList: string[];
};

/* =======================
アカウント系
======================= */
export type AccountInfoOfDB = Omit<_DefaultAuth, 'password'> & {
  user?: Omit<_UserInfo, 'authId'>;
};
export const convertIntoAccountInfoOfDB = (rec: {
  [key: string]: any;
}): AccountInfoOfDB => {
  const data = {
    authId: rec.authId,
    authRole: rec.authRole,
    email: rec.email,
    authType: rec.authType,
    isVerify: rec.isVerify,
    isTrial: rec.isTrial,
  };
  if (rec.userId) {
    return {
      ...data,
      user: {
        userId: rec.userId,
        birthDay: rec.birthDay,
        sex: getEnumValue(SexType, rec.sex),
        gender: rec.gender,
        familyName: rec.familyName,
        givenName: rec.givenName,
        tel: rec.tel,
        profession: rec.profession,
        address: rec.address,
        createdAt: rec.createdAt,
      },
    };
  } else {
    return data;
  }
};
export type AccountInfoDto = Omit<_DefaultAuth, 'authId' | 'password'> & {
  user: Omit<_UserInfo, 'authId'>;
};

export type ClientInfoDto = Omit<AccountInfoDto, 'userId'> & {
  clientId: string;
};
export type JwsTokenSchema = {
  payload: {
    authId: string;
  };
  isExpired: boolean;
};

export type CreateAuthInfoDtoForAccount = Omit<_DefaultAuth, 'authId'>;
export type CreateAccountInfoDto = CreateAuthInfoDtoForAccount & {
  user: CreateUserInfoDto;
};
