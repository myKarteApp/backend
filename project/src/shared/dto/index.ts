export type ResponseOK = {
  message: string;
};

export type DefaultAuthDto = {
  authId?: string; //作成時点ではnullでやってくる
  email: string;
  password: string;
  //作成時点ではnullでやってくる
  authType?: string;
  authRole?: string;
  identityConfirmed?: boolean;
  isTrial?: boolean;
};

export enum SexType {
  male = 'mail',
  female = 'female',
}

export type UserInfoDto = {
  userId?: string; //作成時点ではnullでやってくる
  authId: string;
  birthDay: string;
  sex: SexType;
  gender: string;
  familyName: string;
  givenName: string;
  address: string;
  tel: string;
  profession: string;
  createdAt?: Date; //作成時点ではnullでやってくる
};

export type AccountInfoDto = Omit<DefaultAuthDto & UserInfoDto, 'password'>;
export type JwsTokenSchema = {
  payload: {
    authId: string;
  };
  isExpired: boolean;
};

export type DefaultColumns = 'isDeleted' | 'createdAt' | 'updatedAt';
