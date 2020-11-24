import {Injectable, HttpException, HttpStatus, BadRequestException} from '@nestjs/common';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UserDto} from "../users/dto/user.dto";
import {LoginUserDto} from "../users/dto/user-login.dto";
import {LoginStatus} from "./interfaces/login-status.interface";
import {RegistrationStatus} from "./interfaces/regisration-status.interface";
import {Repository} from "typeorm";
import {User} from "../users/entity/user.entity";

@Injectable()
export class AuthService {
  constructor(
    // private readonly usersService: UsersService,
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
  //   let status: RegistrationStatus = {
  //     success: true,
  //     message: 'user registered',
  //   };
  //
  //   try {
  //     await this.usersService.create(userDto);
  //   } catch (err) {
  //     status = {
  //       success: false,
  //       message: err,
  //     };
  //   }
  //
  //   return status;
  // }
  async login(body, response) {
    if (!body.auth) {
      throw new BadRequestException(`Param is not provided`);
    }
    const parameters = Buffer.from(body.auth, 'base64').toString('ascii').split(':');
    // find user in db
    const user = await this.userRepository.findOne({
      'email': parameters[0],
      'password': parameters[1],
    });

    if (!user) {
      throw new HttpException(`Invalid parameters`, HttpStatus.UNAUTHORIZED);
    }
    // generate and sign token
    const payload = { hash: user.hash, password: user.password };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = new Date(Date.now() + Number(process.env.EXPIRESIN));

    response.cookie('accessToken', accessToken, {expires: expiresIn})
            .send();
  }


  async logout(response) {
    response.clearCookie('accessToken')
            .status(HttpStatus.NO_CONTENT)
            .send();
  }

  // async validateUser(payload: JwtPayload): Promise<UserDto> {
  //   const user = await this.usersService.findByPayload(payload);
  //   if (!user) {
  //     throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //   }
  //   return user;
  // }
  //
  // private _createToken({ username }: UserDto): any {
  //   const expiresIn = process.env.EXPIRESIN;
  //
  //   const user: JwtPayload = { username };
  //   const accessToken = this.jwtService.sign(user);
  //   return {
  //     expiresIn,
  //     accessToken,
  //   };
  // }
}
