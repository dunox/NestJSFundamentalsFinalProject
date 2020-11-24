import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UserDto } from './dto/user.dto';
// import { toUserDto } from '@shared/mapper';
// import { LoginUserDto } from './dto/user-login.dto';
// import { comparePasswords } from '@shared/utils';
import {User} from "./entity/user.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;
    return this.userRepo.find({
      skip: page,
      take: limit,
    });
  }

  async findOne(userHash: string) {
    const user = await this.userRepo.findOne({hash: userHash}, {relations: ['classes']});
    if (!user) {
      throw new NotFoundException(`UserHash: №${userHash} not found`);
    }
    return user;
  }

  // async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
  //   const user = await this.userRepo.findOne({ where: { username } });
  //
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  //   }
  //
  //   // compare passwords
  //   const areEqual = await comparePasswords(user.password, password);
  //
  //   if (!areEqual) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }
  //
  //   return toUserDto(user);
  // }
  //
  // async findByPayload({ username }: any): Promise<UserDto> {
  //   return await this.findOne({ where: { username } });
  // }

  async create(createUserDto: CreateUserDto) {
    // check if the user exists in the db
    // const userInDb = await this.userRepo.findOne({ where: { email }});
    // if (userInDb) {
    //   throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    // }
    const user = this.userRepo.create(createUserDto);

    return this.userRepo.save(user);
  }
  async update(userHash: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      hash: userHash,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User №${userHash} not found`);
    }
    return this.userRepo.save(user);
  }

  async delete(userHash: string) {
    const user = await this.findOne(userHash);
    return this.userRepo.remove(user);
  }
}
