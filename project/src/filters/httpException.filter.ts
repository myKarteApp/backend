import { MyError } from '@/utils/error';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { getCurrentTimeFromRequest } from '@/shared';
import { Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logFilePath: string;
  constructor() {
    this.logFilePath = path.join(__dirname, '../../logs/access.log');
  }

  catch(exception: any, host: ArgumentsHost) {
    // 参照の準備

    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const isMyError = exception instanceof MyError;
    console.log(exception);

    /*
      エラー内容を抽出する
    */
    const status = isMyError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isMyError ? exception.message : 'Internal Server Error';
    const errorCode = isMyError
      ? exception.error.errorCode.toString() + '\n'
      : '';
    const stack = isMyError
      ? exception.stack
      : 'Internal Server Error without MyError';

    const innerStack =
      isMyError && exception.error?.innerError
        ? '\n' + exception.error.innerError.stack
        : '';
    // TODO: access.logに出せるようにする
    console.log(innerStack);

    const errorData =
      isMyError && exception.data ? '\n' + exception.data : undefined;

    /*
      エラーのログを出す
    */
    const idList: string[] = [];
    const pathSegments = request.url
      .split('/')
      .filter((segment) => segment !== '')
      .map((segment) => {
        if (segment.length === 36) {
          idList.push(segment);
          return ':id';
        }
        return segment;
      });
    const maskedPath = pathSegments.join('/');
    const ip = request.headers['x-forwarded-for'];
    const currentTime = getCurrentTimeFromRequest(request);
    const startLogEntry = `[${currentTime.toISOString()} ${status} ERROR] ${request.method} ${maskedPath} HTTP/${request['httpVersion']} ${ip} idList=[${idList.join(', ')}]`;
    const logEntry = `${startLogEntry}\n${errorCode}${stack}`;
    fs.appendFileSync(this.logFilePath, logEntry + '\n', 'utf8');

    /*
      レスポンスを返す
    */
    // TODO: logEntryを外部(プロキシーのstaticでいいかな)に飛ばして保存する
    response.status(status).json({
      error: message,
      data: errorData,
    });
  }
}
