import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Delete
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {VideoService} from "./videos.service";
import {CreateVideoDto} from "./dto/create-video.dto";
import {PaginationQueryDto} from "../../../common/dto/pagination-query.dto";
import {UpdateVideoDto} from "./dto/update-video.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Videos')
@Controller('videos')
export class VideoController {
  constructor(public readonly videoService: VideoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.videoService.findAll(paginationQuery);
  }

  @Get(':hash')
  @UseGuards(AuthGuard())
  findOne(@Param('hash') userHash: string) {
    return this.videoService.findOne(userHash);
  }

  @Put(':hash')
  @UseGuards(AuthGuard())
  update(@Param('hash') hash: string,
         @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(hash, updateVideoDto);
  }

  @Delete(':hash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('hash') hash: string) {
    return this.videoService.delete(hash);
  }
}
