import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseMessageKey } from '../decorators/response.decorator';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MessageKey, ResponseCommon } from '../interceptors/response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  // The intercept function to perform pre-response handling
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Get the message code from metadata using Reflector
        const messageCode = this.reflector.get<string>(ResponseMessageKey, context.getHandler())?.toLowerCase() ?? '';
        // Get the current language from the I18nContext
        const lang = I18nContext.current()?.lang ?? 'en'; // Default to 'en' if undefined

        // Translate the message code into the current language using I18nService
        const response_key: MessageKey = this.i18n.translate(messageCode, {
          lang,
        });

        // Create a common response object
        const res: ResponseCommon = {
          error: '',
          code: response_key.code,
          response: data,
          message: response_key.message || '',
          server_time: new Date().toLocaleString(),
        };
        return res;
      }),
    );
  }
}
