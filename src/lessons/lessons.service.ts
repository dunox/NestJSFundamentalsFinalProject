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
            relations: ['content.videos', 'content.keynotes']
        });
    }

    async findOne(hash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: hash},
          {relations: ['content.videos', 'content.keynotes']}
          );
        if (!lesson) {
            throw new NotFoundException(`No such lessonHash: №${hash} found`);
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
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const lessonPreload = await this.lessonsRepo.preload({
            hash: lessonHash,
            ...updateLessonDto,
            content: {
                videos,
                keynotes
            }

        });

        return this.lessonsRepo.save(lessonPreload);
    }

    async delete(hash: string) {
        const lesson = await this.findOne(hash);
        return this.lessonsRepo.remove(lesson);
    }

    async findVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.videos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.content.videos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`Not found video with hash: ${videoHash} in lesson with hash: ${lessonHash}`);
        }

        return video;
    }

    async addVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.videos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.content.videos.find(video => video.hash === videoHash);
        if (videoExists) {
            throw new BadRequestException(`Video with hash: ${videoHash} is already exists in lesson with hash: ${lessonHash}`);

        }
        lesson.content.videos.push(video);

        return this.lessonsRepo.save(lesson);
    }

    async deleteVideo(lessonHash: string, videoHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.videos'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const video = await this.videoRepo.findOne({'hash': videoHash});
        if (!video) {
            throw new NotFoundException(`Video with hash: ${videoHash} not found`);
        }

        const videoExists = lesson.content.videos.find(video => video.hash === videoHash);
        if (!videoExists) {
            throw new BadRequestException(`Not found video with hash: ${videoHash} in lesson with hash: ${lessonHash}`);
        }
        lesson.content.videos.splice(lesson.content.videos.indexOf(video), 1);

        return this.lessonsRepo.save(lesson);
    }

    async findKeynote(lessonHash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const keyNote = await this.keynoteRepo.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.content.keynotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (!keyNoteExists) {
            throw new BadRequestException(`Not found keyNote with hash: ${keyNoteHash} in lesson with hash: ${lessonHash}`);
        }

        return keyNote;
    }

    async addKeynote(lessonHash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const keyNote = await this.keynoteRepo.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.content.keynotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (keyNoteExists) {
            throw new BadRequestException(`KeyNote with hash: ${keyNoteHash} is already exists in lesson with hash: ${lessonHash}`);

        }
        lesson.content.keynotes.push(keyNote);

        return this.lessonsRepo.save(lesson);
    }

    async deleteKeynote(lessonHash: string, keyNoteHash: string) {
        const lesson = await this.lessonsRepo.findOne({hash: lessonHash}, { relations: ['content.keynotes'] });
        if (!lesson) {
            throw new NotFoundException(`Lesson with hash: ${lessonHash} not found`);
        }

        const keyNote = await this.keynoteRepo.findOne({'hash': keyNoteHash});
        if (!keyNote) {
            throw new NotFoundException(`KeyNote with hash: ${keyNoteHash} not found`);
        }

        const keyNoteExists = lesson.content.keynotes.find(keyNote => keyNote.hash === keyNoteHash);
        if (!keyNoteExists) {
            throw new BadRequestException(`Not found keyNote with hash: ${keyNoteHash} in lesson with hash: ${lessonHash}`);
        }
        lesson.content.keynotes.splice(lesson.content.keynotes.indexOf(keyNote), 1);

        return this.lessonsRepo.save(lesson);
    }
}
