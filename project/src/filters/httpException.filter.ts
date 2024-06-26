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
import * as moment from 'moment-timezone';
import { getQueryParams, getOffsetByName, TimezoneOffset, getCurrentTime } from '@/shared';

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

    const status =
      exception instanceof MyError
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof MyError
        ? exception.message
        : 'Internal Server Error';

    const stack =
      exception instanceof MyError
        ? exception.stack
        : 'Internal Server Error without MyError';

    const ip = request.headers['x-forwarded-for'];

    // 時間の設定をする
    const currentTime = getCurrentTime(request.headers['referer']);
    // ログを出力する
    const startLogEntry = `[${currentTime.toISOString()} ERROR] ${ip} "${request.method} ${request.url} HTTP/${request['httpVersion']}" ${status}`;
    const logEntry = `${startLogEntry}\n${stack}`;
    fs.appendFileSync(this.logFilePath, logEntry + '\n', 'utf8');

    // レスポンスを返す
    // TODO: logEntryを外部に飛ばして保存する
    response.status(status).json({
      error: message,
    });
  }
}
