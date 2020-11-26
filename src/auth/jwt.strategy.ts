import {
  HttpException,
  HttpStatus,
  Injectable} from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {AuthService} from "./auth.service";
// import {JwtPayload} from "./interfaces/payload.interface";
// import {CreateUserDto} from "../users/dto/create-user.dto";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
    super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRETKEY,
    });
}
  async validate(request: Request, payload: any) {
    const cookies = request.headers.cookie.split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});

    const authorization = request.headers['authorization'];
    if (!cookies['accessToken'] || !authorization || authorization.replace('Bearer ', '') !== cookies['accessToken']) {
      return false;
    }

    return { hash: payload.hash, password: payload.password };
  }
    // async validate(payload: JwtPayload): Promise<CreateUserDto> {
    //     const user = await this.authService.validateUser(payload);
    //     if (!user) {
    //       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    //     }
    //
    //     return user;
    // }
}