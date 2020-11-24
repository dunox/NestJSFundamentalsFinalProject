import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UsePipes,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
// import { CreateUserDto } from '@user/dto/user.create.dto';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // public async register(
  //   @Body() createUserDto: CreateUserDto,
  // ): Promise<RegistrationStatus> {
  //   const result: RegistrationStatus = await this.authService.register(
  //     createUserDto,
  //   );
  //
  //   if (!result.success) {
  //     throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  //   }
  //
  //   return result;
  // }

  @Post('/login')
  async login(@Body() body, @Res() response: Response ) {
    return await this.authService.login(body, response);
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
