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
import {KeynotesService} from "./keynotes.service";
import {PaginationQueryDto} from "../../../common/dto/pagination-query.dto";
import {CreateKeynoteDto} from "./dto/create-keynote.dto";
import { AuthGuard } from "@nestjs/passport";
import {UpdateKeynoteDto} from "./dto/update-keynote.dto";

@ApiTags('Keynotes')
@Controller('keynotes')
export class KeynotesController {
  constructor(public readonly keynotesService: KeynotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createKeynoteDto: CreateKeynoteDto) {
    return this.keynotesService.create(createKeynoteDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.keynotesService.findAll(paginationQuery);
  }

  @Get(':hash')
  @UseGuards(AuthGuard())
  findOne(@Param('hash') userHash: string) {
    return this.keynotesService.findOne(userHash);
  }

  @Put(':hash')
  @UseGuards(AuthGuard())
  update(@Param('hash') hash: string,
         @Body() updateKeynoteDto: UpdateKeynoteDto) {
    return this.keynotesService.update(hash, updateKeynoteDto);
  }

  @Delete(':hash')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('hash') hash: string) {
    return this.keynotesService.delete(hash);
  }
}
