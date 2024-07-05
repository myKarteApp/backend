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
