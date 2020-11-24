import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import {LessonsService} from "./lessons.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@Controller('lessons')
@ApiTags('Lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Get()
    @UseGuards(AuthGuard())
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.lessonsService.findAll(paginationQuery);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard())
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @Get(':lessonHash')
    @UseGuards(AuthGuard())
    findOne(@Param('lessonHash') lessonHash: string) {
        return this.lessonsService.findOne(lessonHash);
    }

    @Put(':lessonHash')
    @UseGuards(AuthGuard())
    update(@Param('lessonHash') lessonHash: string,
           @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(lessonHash, updateLessonDto);
    }

    @Delete(':lessonHash')
    @UseGuards(AuthGuard())
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('lessonHash') lessonHash: string) {
        return this.lessonsService.delete(lessonHash);
    }

    @Post(':lessonHash/videos')
    @UseGuards(AuthGuard())
    addVideo(@Param('lessonHash') lessonHash: string,
             @Body('videoHash') videoHash: string) {
        return this.lessonsService.addVideo(lessonHash, videoHash);
    }

    @Post(':lessonHash/keynotes')
    @UseGuards(AuthGuard())
    addKeynote(@Param('lessonHash') lessonHash: string,
               @Body('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.addKeynote(lessonHash, keyNoteHash);
    }

    @Get(':lessonHash/videos/:videoHash')
    @UseGuards(AuthGuard())
    findVideo(@Param('lessonHash') lessonHash: string,
              @Param('videoHash') videoHash: string) {
        return this.lessonsService.findVideo(lessonHash, videoHash);
    }

    @Delete(':lessonHash/videos/:videoHash')
    @UseGuards(AuthGuard())
    deleteVideo(@Param('lessonHash') lessonHash: string,
                @Param('videoHash') videoHash: string) {
        return this.lessonsService.deleteVideo(lessonHash, videoHash);
    }

    @Get(':lessonHash/keynotes/:keyNoteHash')
    @UseGuards(AuthGuard())
    findKeynote(@Param('lessonHash') lessonHash: string,
                @Param('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.findKeynote(lessonHash, keyNoteHash);
    }

    @Delete(':lessonHash/keynotes/:keyNoteHash')
    @UseGuards(AuthGuard())
    deleteKeynote(@Param('lessonHash') lessonHash: string,
                  @Param('keyNoteHash') keyNoteHash: string) {
        return this.lessonsService.deleteKeynote(lessonHash, keyNoteHash);
    }
}
