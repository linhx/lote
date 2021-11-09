import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import safeStringify from 'fast-safe-stringify';
const { combine, timestamp, errors, printf } = winston.format;

// tslint:disable-next-line:no-shadowed-variable
const format = printf(({ timestamp, level, label, message, stack, ...others }:
   { timestamp: string, level: string, label: string, message: any, stack: any, others: { [key in symbol]: string } }) => {
  const namespace = label ? `(${label})` : '';
  const errStack = stack ? `\n${stack}` : '';

  let meta = '';
  if (level === 'error') {
    const args = others[Symbol.for('splat')];
    meta = args? `\n\t${args.map(safeStringify).join('\n\t')}` : '';
  }
  return `[${timestamp}] ${level}: ${namespace} ${message} ${meta} ${errStack}`;
})

const transportError = new winston.transports.DailyRotateFile({
  filename: 'be-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '20d',
  level: 'error',
  utc: true,
  dirname: process.env.LOG_FOLDER
});

const transportCombined = new winston.transports.DailyRotateFile({
  filename: 'be-combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '20d',
  utc: true,
  dirname: process.env.LOG_FOLDER
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    format
  ),
  transports: [
    transportError,
    transportCombined
  ]
});

export class Logger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    logger.log('info', message, optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    logger.error(message, optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    logger.warn(message, optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    logger.debug(message, optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    logger.verbose(message, optionalParams);
  }
}
