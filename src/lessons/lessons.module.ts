import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from "./entities/lesson.entity";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";
import {Video} from "./content/videos/entities/video.entity";
import {Keynote} from "./content/keynotes/entities/keynote.entity";

@Module({
    imports: [
        LessonsModule,
        TypeOrmModule.forFeature([Lesson, Video, Keynote]),
    ],
    controllers: [LessonsController],
    providers: [LessonsService],
    exports: [TypeOrmModule]
})
export class LessonsModule {}
