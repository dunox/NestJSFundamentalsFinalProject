import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Lesson} from "../entities/lesson.entity";
import {Video} from "./videos/entities/video.entity";
import {VideoController} from "./videos/videos.controller";
import {VideoService} from "./videos/videos.service";
import {Keynote} from "./keynotes/entities/keynote.entity";
import {KeynotesController} from "./keynotes/keynotes.controller";
import {KeynotesService} from "./keynotes/keynotes.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Video, Keynote, Lesson]),
    ],
    controllers: [VideoController, KeynotesController],
    providers: [VideoService, KeynotesService],
    exports: [TypeOrmModule]
})
export class ContentModule {}
