import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CheckLoginMiddleware } from './middleware/checkLogin.middlerware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {dbConfig} from '@src/database/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from '@src/modules/blogs/blogs.module';
import { CommentModule } from '@src/modules/comments/comments.module';
import { CreationService } from '@src/modules/creation/creation.service';
import { CreationModule } from '@src/modules/creation/creation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbConfig,
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    CommentModule,
    CreationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
  ],
})
// export class AppModule {

// }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckLoginMiddleware).exclude('auth/login').forRoutes('*');
  }
}
