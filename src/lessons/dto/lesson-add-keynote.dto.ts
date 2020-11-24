import {IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LessonsAddKeynote {
  @IsNumber()
  @ApiProperty({ example: '10ba038e-48da-487b-96e8-8d3b99b6d18a'})
  keynoteHash: string;
}
