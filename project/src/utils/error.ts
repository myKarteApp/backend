import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodeKey } from './errorCode';

type ErrorBody = {
  code: HttpStatus;
  status: string;
  message: string;
  errorCode: number;
  innerError?: Error;
};

export class MyError extends HttpException {
  error: ErrorBody;

  constructor(errorBody: ErrorBody) {
    super(errorBody.status, errorBody.code);
    this.error = errorBody;
  }
}

export const NotFound = (errorCodeKey: ErrorCodeKey) => {
  return new MyError({
    code: HttpStatus.NOT_FOUND,
    status: 'NotFound',
    message: 'NotFound',
    errorCode: ErrorCode[errorCodeKey],
  });
};

export const Unexpected = (errorCodeKey: ErrorCodeKey) => {
  return new MyError({
    code: HttpStatus.EXPECTATION_FAILED,
    status: 'Unexpected',
    message: 'Unexpected',
    errorCode: ErrorCode[errorCodeKey],
  });
};

export const Disconnect = (errorCodeKey: ErrorCodeKey) => {
  return new MyError({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    status: ' Disconnect',
    message: 'Unexpected',
    errorCode: ErrorCode[errorCodeKey],
  });
};
