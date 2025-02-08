import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CheckLoginMiddleware } from './middleware/checkLogin.middlerware';
import { CustomUnauthorizedExceptionFilter } from './middleware/custom-unauthorized-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomUnauthorizedExceptionFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckLoginMiddleware).exclude('auth/login').forRoutes('*');
  }
}
