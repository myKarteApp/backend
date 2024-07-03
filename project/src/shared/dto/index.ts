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

export type RegisterDto = {
  email: string;
  password: string;
  passCode: string;
  queryToken: string;
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
