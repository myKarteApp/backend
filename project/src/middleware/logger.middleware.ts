// logger.middleware.ts
import { getCurrentTimeFromRequest } from '@/shared';
import { ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
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

  use(request: Request, response: Response, next: NextFunction) {
    console.log('=== NestMiddleware ===');

    const startTime: Date = getCurrentTimeFromRequest(request);
    const ip = request.headers['x-forwarded-for'];

    // リクエストの開始時のログを出力
    const idList: string[] = [];
    const pathSegments = request.originalUrl
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
    const requestInfo = `${request.method} ${maskedPath} HTTP/${request.httpVersion} ${ip} idList=[${idList.join(', ')}]`;

    const startLogEntry = `[${startTime.toISOString()}   START] ${requestInfo}`;
    this.writeLog(startLogEntry);

    // レスポンスの終了時に処理時間を計算してログを出力
    response.on('finish', () => {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const endLogEntry = `[${endTime.toISOString()} ${response.statusCode} END] ${requestInfo} - ${duration}ms`;
      this.writeLog(endLogEntry);
    });

    next();
  }

  private writeLog(logEntry: string) {
    this.logStream.write(logEntry + '\n');
  }
}
