import { HttpExceptionFilter } from './interceptors/exception.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import path from 'path';
import configuration from './config/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfigService } from './config/database';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import redisConfiguration from './config/redis.config';
import { NestJSTestController } from './api/nestjsTest.controller';
import { V1Module } from './api/v1/v1.module';
import { AssetModule } from './api/v1/asset/asset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, redisConfiguration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, './i18n/'),
          watch: false,
        },
      }),
      // parser: I18nJsonParser,
      // inject: [ConfigService],
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    V1Module,
    AssetModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [NestJSTestController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [],
})
export class AppModule {}
