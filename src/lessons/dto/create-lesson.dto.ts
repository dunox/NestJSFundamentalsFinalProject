import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max
} from 'class-validator';
import {Type} from "class-transformer";

class Content {
    @IsNumber({},{each:true})
    videos: number[];

    @IsNumber({},{each:true})
    keynotes: number[];
}

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsNumber()
    @Min(1)
    @Max(9999)
    readonly order: number;

    @Type(() => Content)
    content: Content;
}
