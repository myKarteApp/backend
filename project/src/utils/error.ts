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
  data?: { [key: string]: any } | undefined;

  constructor(errorBody: ErrorBody, data?: { [key: string]: any }) {
    super(errorBody.status, errorBody.code);
    this.error = errorBody;
    this.data = data;
  }
}

export const NotFound = (
  errorCode: ErrorCode,
  data?: { [key: string]: any },
) => {
  return new MyError(
    {
      code: HttpStatus.NOT_FOUND,
      status: 'NotFound',
      message: 'NotFound',
      errorCode: errorCode,
    },
    data,
  );
};

export const Unexpected = (
  errorCode: ErrorCode,
  data?: { [key: string]: any },
) => {
  return new MyError(
    {
      code: HttpStatus.EXPECTATION_FAILED,
      status: 'Unexpected',
      message: 'Unexpected',
      errorCode: errorCode,
    },
    data,
  );
};

export const Disconnect = (
  errorCode: ErrorCode,
  data?: { [key: string]: any },
) => {
  return new MyError(
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      status: ' Disconnect',
      message: 'Disconnect',
      errorCode: errorCode,
    },
    data,
  );
};

export const Unauthorized = (
  errorCode: ErrorCode,
  data?: { [key: string]: any },
) => {
  return new MyError(
    {
      code: HttpStatus.UNAUTHORIZED,
      status: 'Unauthorized',
      message: 'Unauthorized',
      errorCode: errorCode,
    },
    data,
  );
};

export const BadRequest = (
  errorCode: ErrorCode,
  data?: { [key: string]: any },
) => {
  return new MyError(
    {
      code: HttpStatus.BAD_REQUEST,
      status: 'Bad Request',
      message: 'Bad Request',
      errorCode: errorCode,
    },
    data,
  );
};
