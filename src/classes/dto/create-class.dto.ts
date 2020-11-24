import {
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min
} from 'class-validator';
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

class Duration {

  @IsDate()
  started: Date;

  @IsDate()
  closed: Date;
}
export class CreateClassDto {
  @ApiProperty({ example: 'Backend' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Backend Online Course' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: '2' })
  @IsNumber()
  @Min(1)
  @Max(9999)
  readonly order: number;

  @ApiProperty({ example: '{ started: 2019-06-19T07:44:06.353Z, closed: 2019-06-19T07:44:06.353Z}' })
  @Type(() => Duration)
  @IsObject()
  duration: Duration;
}