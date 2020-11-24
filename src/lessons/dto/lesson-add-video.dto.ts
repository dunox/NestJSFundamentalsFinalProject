import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class LessonsAddVideo {
  @IsString()
  @ApiProperty({ example: '10ba038e-48da-487b-96e8-8d3b99b6d18a\n' })
  videoHash: string;
}
