// logger.middleware.ts
import { getCurrentTime } from '@/shared';
import { Unexpected } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logFilePath: string;
  private logStream: fs.WriteStream;

  constructor() {
    this.logFilePath = path.join(__dirname, '../../logs/access.log');
    this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
  }

  use(request: Request, res: Response, next: NextFunction) {
    const { referer } = request.headers;
    if (!referer) throw Unexpected(ErrorCode.Error16);
    const startTime: Date = getCurrentTime(referer);
    const ip = request.headers['x-forwarded-for'];

    // リクエストの開始時のログを出力
    const startLogEntry = `[${startTime.toISOString()} START] ${ip} "${request.method} ${request.originalUrl} HTTP/${request.httpVersion}"`;
    this.writeLog(startLogEntry);

    // レスポンスの終了時に処理時間を計算してログを出力
    res.on('finish', () => {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const endLogEntry = `[${endTime.toISOString()}   END] ${ip} "${request.method} ${request.originalUrl} HTTP/${request.httpVersion}" ${res.statusCode} - ${duration}ms`;
      this.writeLog(endLogEntry);
    });

    next();
  }

  private writeLog(logEntry: string) {
    this.logStream.write(logEntry + '\n');
  }
}
