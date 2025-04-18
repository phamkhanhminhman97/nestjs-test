import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MessageKey, ResponseCommon } from '../interceptors/response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}
  // The catch method handles exceptions and sends an appropriate response
  catch(exception: HttpException, host: ArgumentsHost) {
    // Get the HTTP response object from the host
    const res = host.switchToHttp().getResponse<Response>();

    // Get the HTTP status code from the exception
    const status = exception.getStatus();

    // Extract the error object from the exception response (cast to any)
    const errException = exception.getResponse() as any;

    const errorCode = errException.error?.toLowerCase();
    // Get the current language from the I18nContext
    const lang = I18nContext.current()?.lang ?? 'en';
    // Translate the error message into the current language
    const response_key: MessageKey = this.i18n.translate(errorCode || 'common.server_error', {
      lang,
    });

    // Create the response object to be sent
    const response: ResponseCommon = {
      code: response_key.code || errException.statusCode,
      message: `${response_key?.message || ''} ${errException?.message || ''}`.trim(),
      error: errException.error,
      server_time: new Date().toLocaleString(),
    };

    // Set the HTTP status code and send the response as JSON
    res.status(status).json(response);
  }
}
