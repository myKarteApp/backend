type Error = {
  [key: string]: string;
};

export class Validator {
  error: Error = {};
  constructor() {
    this.error = {};
  }
  public pushError(key: string, message: string) {
    this.error[key] = message;
  }
  public hasError() {
    return Object.keys(this.error).length > 0;
  }
}

export const validateEmail = (validator: Validator, email?: string) => {
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      validator.pushError('email', 'emailを正しく入力しください。');
  } else {
    validator.pushError('email', 'emailを入力しください。');
  }
};

export const validatePassword = (validator: Validator, password?: string) => {
  if (password) {
    if (Object.keys(password).length < 8)
      validator.pushError(
        'password',
        'passwordを8文字以上で記載してください。',
      );
  } else {
    validator.pushError('email', 'passwordを入力してください。');
  }
};
