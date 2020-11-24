import {IsString, IsEnum, IsEmail, IsNotEmpty, IsOptional, Validate} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import {sexEnum} from "../unem/sex.enum";
import {roleEnum} from "../unem/role.enum";


export class CreateUserDto {

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'jdoe@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: '+380662332377' })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ example: 'ab12345Cd' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'm' })
  @IsEnum(sexEnum)
  @IsNotEmpty()
  readonly sex: sexEnum;

  @ApiProperty({ example: 'newbie' })
  @IsEnum(roleEnum)
  @IsOptional()
  readonly role: roleEnum;
}