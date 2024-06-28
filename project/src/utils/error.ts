import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './errorCode';

type ErrorBody = {
  code: HttpStatus;
  status: string;
  message: string;
  errorCode: ErrorCode;
  innerError?: Error;
};

export class MyError extends HttpException {
  error: ErrorBody;

  constructor(errorBody: ErrorBody) {
    super(errorBody.status, errorBody.code);
    this.error = errorBody;
  }
}

export const NotFound = (errorCode: ErrorCode) => {
  return new MyError({
    code: HttpStatus.NOT_FOUND,
    status: 'NotFound',
    message: 'NotFound',
    errorCode: errorCode,
  });
};

export const Unexpected = (errorCode: ErrorCode) => {
  return new MyError({
    code: HttpStatus.EXPECTATION_FAILED,
    status: 'Unexpected',
    message: 'Unexpected',
    errorCode: errorCode,
  });
};

export const Disconnect = (errorCode: ErrorCode) => {
  return new MyError({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    status: ' Disconnect',
    message: 'Disconnect',
    errorCode: errorCode,
  });
};

export const Unauthorized = (errorCode: ErrorCode) => {
  return new MyError({
    code: HttpStatus.UNAUTHORIZED,
    status: 'Unauthorized',
    message: 'Unauthorized',
    errorCode: errorCode,
  });
};

export const BadRequest = (errorCode: ErrorCode) => {
  return new MyError({
    code: HttpStatus.BAD_REQUEST,
    status: 'Bad Request',
    message: 'Bad Request',
    errorCode: errorCode,
  });
};
