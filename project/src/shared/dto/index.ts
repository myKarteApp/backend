export type ResponseOK = {
  message: string;
};

type LoginProps = {
  email: string;
  password: string;
};

export class DefaultAuthDto {
  public email: string;
  public password: string;

  constructor(props: LoginProps) {
    this.email = props.email;
    this.password = props.password;
  }

  public static getEmpty(): DefaultAuthDto {
    return new DefaultAuthDto({
      email: '',
      password: '',
    });
  }

  public isEmpty(): boolean {
    if (this.email && this.password) return true;
    return false;
  }
}

export enum SexType {
  male = 'mail',
  female = 'female',
}

export type UserInfoDto = {
  authId: string;
  birthDay: string;
  sex: SexType;
  gender: string;
  familyName: string;
  givenName: string;
  address: string;
  tel: string;
  profession: string;
};

type AccountProps = LoginProps & {
  userId: string;
};

export class AccountDto extends DefaultAuthDto {
  public userId: string;
  constructor(props: AccountProps) {
    super(props);
    this.userId = props.userId;
  }

  public static getEmpty(): AccountDto {
    return new AccountDto({
      userId: '',
      email: '',
      password: '',
    });
  }

  public isEmpty(): boolean {
    if (super.isEmpty() && this.userId) return true;
    return false;
  }
}

export type JwsTokenSchema = {
  payload: {
    authId: string;
  };
  isExpired: boolean;
};

export type DefaultColumns = 'isDeleted' | 'createdAt' | 'updatedAt';
