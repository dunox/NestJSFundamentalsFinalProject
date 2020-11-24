import {Injectable} from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {AuthService} from "./auth.service";
import {JwtPayload} from "./interfaces/payload.interface";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
    super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRETKEY,
    });
}

async validate(payload: JwtPayload): Promise<CreateUserDto> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
}
return user;
}
}