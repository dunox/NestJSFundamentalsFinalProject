import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Lesson} from "./entities/lesson.entity";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {Video} from "./content/videos/entities/video.entity";
import {Keynote} from "./content/keynotes/entities/keynote.entity";

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonsRepo: Repository<Lesson>,
        @InjectRepository(Video)
        private readonly videoRepo: Repository<Video>,
        @InjectRepository(Keynote)
        private readonly keynoteRepo: Repository<Keynote>,
    ) {}

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.lessonsRepo.find({
            skip: page,
            take: limit,
            relations: ['videos', 'keynotes']
        });
    }

    async findOne(lessonHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash},
          {relations: ['videos', 'keynotes']}
          );
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }
        return lesson;
    }

    create(createLessonDto: CreateLessonDto) {
        const lesson = this.lessonsRepo.create(createLessonDto);
        return this.lessonsRepo.save(lesson);
    }

    async update(lessonHash: string, updateLessonDto: UpdateLessonDto) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash});
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const lessonPreload = await this.lessonsRepo.preload({
            id: lesson.id,
            hash: lesson.hash,
            ...updateLessonDto,
        });

        return this.lessonsRepo.save(lessonPreload);
    }

    async delete(hash: string) {
        const lesson = await this.findOne(hash);
        return this.lessonsRepo.remove(lesson);
    }

    async findVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['videos'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`No such videoHash: №${videoHash} found`);
        }

        const videoExists = lesson.videos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`No such videoHash: №${videoHash} found in lessonHash: №${lessonHash}`);
        }

        return video;
    }

    async addVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['videos'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`No such videoHash: №${videoHash} found`);
        }

        const videoExists = lesson.videos.find(video => video.hash === videoHash);
        if (videoExists) {
            throw new BadRequestException(`VideoHash: №${videoHash} exists in lessonHash: №${lessonHash}`);

        }
        lesson.videos.push(video);

        return this.lessonsRepo.save(lesson);
    }

    async deleteVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['videos'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`No such videoHash: №${videoHash} found`);
        }

        const videoExists = lesson.videos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`No such videoHash: №${videoHash} in lessonHash: №${lessonHash}`);
        }
        lesson.videos.splice(lesson.videos.indexOf(video), 1);

        return this.lessonsRepo.save(lesson);
    }

    async findKeynote(lessonHash: string, keynoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const keynote = await this.keynoteRepo.findOne({'hash': keynoteHash});
        if (!keynote) {
            throw new NotFoundException(`No such keynoteHash: №${keynoteHash} found`);
        }

        const keynoteExists = lesson.keynotes.find(keynote => keynote.hash === keynoteHash);
        if (!keynoteExists) {
            throw new BadRequestException(`No such keynoteHash: №${keynoteHash} found in lessonHash: №${lessonHash}`);
        }

        return keynote;
    }

    async addKeynote(lessonHash: string, keynoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const keynote = await this.keynoteRepo.findOne({'hash': keynoteHash});
        if (!keynote) {
            throw new NotFoundException(`No such keynoteHash: №${keynoteHash} found`);
        }

        const keynoteExists = lesson.keynotes.find(keynote => keynote.hash === keynoteHash);
        if (keynoteExists) {
            throw new BadRequestException(`KeynoteHash: №${keynoteHash} exists in lessonHash: №${lessonHash}`);

        }
        lesson.keynotes.push(keynote);

        return this.lessonsRepo.save(lesson);
    }

    async deleteKeynote(lessonHash: string, keynoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${lessonHash} found`);
        }

        const keynote = await this.keynoteRepo.findOne({'hash': keynoteHash});
        if (!keynote) {
            throw new NotFoundException(`No such keynoteHash: №${keynoteHash} found`);
        }

        const keynoteExists = lesson.keynotes.find(keyNote => keyNote.hash === keynoteHash);
        if (!keynoteExists) {
            throw new BadRequestException(`No such keynoteHash: №${keynoteHash} found in lessonHash: №${lessonHash}`);
        }
        lesson.keynotes.splice(lesson.keynotes.indexOf(keynote), 1);

        return this.lessonsRepo.save(lesson);
    }
}
