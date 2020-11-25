import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../../../common/dto/pagination-query.dto";
import {Video} from "./entities/video.entity";
import {UpdateVideoDto} from "./dto/update-video.dto";
import {CreateVideoDto} from "./dto/create-video.dto";

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>
  ) {}

  create(createVideoDto: CreateVideoDto) {
    const keyNote = this.videoRepo.create(createVideoDto);
    return this.videoRepo.save(keyNote);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;
    return this.videoRepo.find({
      skip: page,
      take: limit,
    });
  }

  async findOne(contentHash: string) {
    const content = await this.videoRepo.findOne({hash: contentHash});
    if (!content) {
      throw new NotFoundException(`No such contentHash: ${contentHash} found`);
    }
    return content;
  }

  async update(videoHash: string, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepo.findOne({hash: videoHash});
    if (!video) {
      throw new NotFoundException(`No such videoHash: ${videoHash} found`);
    }
    const videoRepo = await this.videoRepo.preload({
      hash: video.hash,
      ...updateVideoDto,
    });

    return this.videoRepo.save(videoRepo);
  }

  async delete(hash: string) {
    const content = await this.findOne(hash);
    return this.videoRepo.remove(content);
  }
}
