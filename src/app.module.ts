import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { SessionLoggerMiddleware } from './middleware/session-logger.middleware';
import { CookieLoggerMiddleware } from './middleware/cookie-logger.middleware';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SecurityModule } from './modules/security/security.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisService } from './database/redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './src/.../.env',
    }),
    SecurityModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // constructor(
  //   private readonly configService: ConfigService,
  //   private readonly redisService: RedisService,
  // ) {}

  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(
    //     session({
    //       store: new RedisStore({
    //         client: this.redisService.client,
    //         ttl: Number(this.configService.get<string>('SESSION_EXPIRE')), // Set ttl in second
    //       }),
    //       secret: this.configService.get<string>('SESSION_SECRET'),
    //       resave: false,
    //       saveUninitialized: false,
    //       cookie: {
    //         httpOnly: true,
    //         secure: false, // Set to true if using HTTPS
    //         //maxAge: Number(this.configService.get<string>('SESSION_EXPIRE')) * 1000, // Set ttl in milisecond -> This will cause the cookie to not function properly
    //       },
    //     }),
    //   )
    //   .forRoutes({ path: '/auth/*', method: RequestMethod.ALL });
    consumer
      .apply(
        cookieParser(),
        csurf({
          cookie: {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            // sameSite: 'strict',
          },
        }),
      )
      .forRoutes('*');
    consumer.apply(CookieLoggerMiddleware).forRoutes('*');
  }
}
