import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorBody = {
  code: HttpStatus;
  status: string;
  message: string;
};

export class MyError extends HttpException {
  error: ErrorBody;

  constructor(errorBody: ErrorBody) {
    super(errorBody.status, errorBody.code);
    this.error = errorBody;
  }
}

export const NotFound = () => {
  return new MyError({
    code: HttpStatus.NOT_FOUND,
    status: 'NotFound',
    message: 'NotFound',
  });
};

export const Unexpected = () => {
  return new MyError({
    code: HttpStatus.EXPECTATION_FAILED,
    status: 'Unexpected',
    message: 'Unexpected',
  });
};
