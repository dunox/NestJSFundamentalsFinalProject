import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiTags
} from "@nestjs/swagger";
import {UsersService} from "./users.service";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':userHash')
  @UseGuards(AuthGuard())
  async findOne(@Param('userHash') userHash: string) {
    const user = this.usersService.findOne(userHash);
    if (!user) {
      throw new NotFoundException(`User №${userHash} not found`);
    }
    return user;
  }

  @Put(':userHash')
  @UseGuards(AuthGuard())
  async update(@Param('userHash') userHash: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userHash, updateUserDto);
  }

  @Delete(':userHash')
  @UseGuards(AuthGuard())
  async delete(@Param('userHash') userHash: string) {
     return this.usersService.delete(userHash);
  }
}