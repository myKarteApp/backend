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
