import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../../../common/dto/pagination-query.dto";
import {CreateKeynoteDto} from "./dto/create-keynote.dto";
import {UpdateKeynoteDto} from "./dto/update-keynote.dto";
import {Keynote} from "./entities/keynote.entity";

@Injectable()
export class KeynotesService {
  constructor(
    @InjectRepository(Keynote)
    private readonly keynotesRepo: Repository<Keynote>
  ) {}

  create(createKeynoteDto: CreateKeynoteDto) {
    const keyNote = this.keynotesRepo.create(createKeynoteDto);
    return this.keynotesRepo.save(keyNote);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;
    return this.keynotesRepo.find({
      skip: page,
      take: limit,
    });
  }

  async findOne(contentHash: string) {
    const content = await this.keynotesRepo.findOne({hash: contentHash});
    if (!content) {
      throw new NotFoundException(`No such contentHash: ${contentHash} found`);
    }
    return content;
  }

  async update(keynoteHash: string, updateKeynoteDto: UpdateKeynoteDto) {
    const keynote = await this.keynotesRepo.findOne({hash: keynoteHash});
    if (!keynote) {
      throw new NotFoundException(`No such keynoteHash: ${keynoteHash} found`);
    }
    const keynotePreload = await this.keynotesRepo.preload({
      hash: keynote.hash,
      ...updateKeynoteDto,
    });

    return this.keynotesRepo.save(keynotePreload);
  }

  async delete(hash: string) {
    const content = await this.findOne(hash);
    return this.keynotesRepo.remove(content);
  }
}
