import {Module, ValidationPipe} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {APP_PIPE} from "@nestjs/core";
import {AuthModule} from "./auth/auth.module";
import {AuthController} from './auth/auth.controller';
import {AuthService} from "./auth/auth.service";
import {ClassModule} from "./classes/classes.module";
import {ContentModule} from "./lessons/content/content.module";
import {UsersModule} from "./users/users.module";
import {LessonsModule} from "./lessons/lessons.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      AuthModule,
      UsersModule,
      LessonsModule,
      ClassModule,
      ContentModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}