import {ApiProperty} from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  Max,
  Min
} from "class-validator";

export class CreateVideoDto {
  @ApiProperty({ example: 'Node.js introduction' })
  @IsString()
  title: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  @Min(1)
  @Max(9999)
  order: number;

  @ApiProperty({ example: 'https://lectrum.io/videos/lesson-1' })
  @IsString()
  uri: string;
}
