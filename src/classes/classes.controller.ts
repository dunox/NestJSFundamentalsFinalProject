import {
  BadRequestException,
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
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {ClassService} from "./classes.service";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.classService.findAll(paginationQuery);
  }

  @Get(':classHash')
  @UseGuards(AuthGuard())
  async findOne(@Param('classHash') classHash: string) {
    return this.classService.findOne(classHash);
  }

  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Put(':classHash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.ACCEPTED)
  async updateClass(@Param('classHash') classHash: string,
               @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(classHash, updateClassDto);
  }

  @Delete(':classHash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.GONE)
  async deleteClass(@Param('classHash') classHash: string) {
    return this.classService.delete(classHash);
  }

  @Post(':classHash/lessons')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  addLesson(@Param('classHash') classHash: string,
            @Body('lessonHash') lessonHash: string) {
    if (!lessonHash) {
      throw new BadRequestException(`No such lessonHash found`);
    }
    return this.classService.addLesson(classHash, lessonHash);
  }

  @Delete(':classHash/lessons/:lessonHash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.GONE)
  deleteLesson(@Param('classHash') classHash: string,
               @Param('lessonHash') lessonHash: string) {
    return this.classService.deleteLesson(classHash, lessonHash);
  }

  @Post(':classHash/enroll')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  enroll(@Param('classHash') classHash: string,
         @Body('userHash') userHash: string) {
    if (!userHash) {
      throw new BadRequestException(`No such userHash found`);
    }
    return this.classService.enroll(classHash, userHash);
  }

  @Delete(':classHash/expel/:userHash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.GONE)
  expel(@Param('classHash') classHash: string,
        @Param('userHash') userHash: string) {
    return this.classService.expel(classHash, userHash);
  }
}
