import { AuthRole, AuthType } from '../enum';
import { Validator } from '../utils/error';

export function getEnumValue<T extends { [key: string]: string }>(
  enumType: T,
  value: string,
): T[keyof T] {
  const enumValues = Object.values(enumType) as string[];
  if (enumValues.includes(value)) {
    return value as T[keyof T];
  } else {
    throw new Error(`Value '${value}' does not exist in enum`);
  }
}

export type ResponseOK = {
  message: string;
};

export type DefaultAuthDto = {
  authId?: string; //作成時点ではnullでやってくる
  email: string;
  password: string;
  authType?: string;
  authRole?: number;
  isVerify?: boolean;
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
    const authRole = Object.keys(AuthRole)
      .filter((key) => !isNaN(Number(AuthRole[key])))
      .map((key) => Number(AuthRole[key]));
    if (!authRole.includes(dto.authRole))
      validator.pushError('authRoles', '認可が不正です。');
  }
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
  male = 'male',
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

export type CreateUserInfo = {
  birthDay: Date;
  sex: SexType;
  gender: string;
  familyName: string;
  givenName: string;
  address: string;
  tel: string;
  profession: string;
};

export type AccountInfoDto = Omit<DefaultAuthDto, 'authId' | 'password'> & {
  user: Omit<UserInfoDto, 'authId'>;
};

export type AccountInfo = AccountInfoDto & {
  authId: string;
  authRole: AuthRole;
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

export type CreateAccountInfoDto = {
  // AuthInfo
  email: string;
  password: string;
  authType: string;
  authRole: number;
  isVerify: boolean;
  isTrial: boolean;
  user: {
    // UserInfo
    birthDay: Date;
    sex: SexType;
    gender: string;
    familyName: string;
    givenName: string;
    address: string;
    tel: string;
    profession: string;
  };
};

export type DefaultColumns = 'isDeleted' | 'createdAt' | 'updatedAt';

export type UserIdListDto = {
  userIdList: string[];
};
