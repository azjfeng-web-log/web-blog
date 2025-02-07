import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CheckLoginMiddleware } from './middleware/checkLogin.middlerware';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckLoginMiddleware)
      .exclude(
        'auth/login',
      )
      .forRoutes('*');
  }
}
