type error = {
  [key: string]: string;
};

export class Validator {
  error: error = {};
  public pushError(key: string, message: string) {
    this.error[key] = message;
  }
  public hasError() {
    return Object.keys(this.error).length > 0;
  }
}
