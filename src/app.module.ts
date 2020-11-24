import {Module, ValidationPipe} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {APP_PIPE} from "@nestjs/core";
import {AuthModule} from "./auth/auth.module";
import {AuthController} from './auth/auth.controller';
import {AuthService} from "./auth/auth.service";
import { ClassesController } from './classes/classes.controller';
import { ClassesService } from './classes/classes.service';
import { ClassesModule } from './classes/classes.module';
import { VideosController } from './lessons/content/videos/videos.controller';
import { VideosService } from './lessons/content/videos/videos.service';
import { VideosModule } from './lessons/content/videos/videos.module';
import { KeynotesModule } from './lessons/content/keynotes/keynotes.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot(),
    AuthModule,
    ClassesModule,
    VideosModule,
    KeynotesModule,
  ],
  controllers: [
    AppController,
    AuthController,
    ClassesController,
    VideosController
  ],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    ClassesService,
    VideosService
  ],
})
export class AppModule {}
