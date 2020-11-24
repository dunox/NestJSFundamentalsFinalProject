import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Class} from "./entities/class.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {User} from "../users/entity/user.entity";
import {Lesson} from "../lessons/entities/lesson.entity";

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {

  }
  async findOne(classHash: string) {
    const classEntity = await this.classRepo.findOne(
      {hash: classHash},
      {relations: ['students', 'lessons']}
      );
    if (!classEntity) {
      throw new NotFoundException(`Class with hash: ${classHash} not found`);
    }
    return classEntity;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;
    return this.classRepo.find({
      skip: page,
      take: limit,
    });
  }

  create(createClassDto: CreateClassDto) {
    const classUnit = this.classRepo.create(createClassDto);
    return this.classRepo.save(classUnit);
  }

  async update(classHash: string, updateClassDto: UpdateClassDto) {
    const classUnit = await this.classRepo.findOne({hash: classHash});
    const classPreload = await this.classRepo.preload({
      hash: classUnit.hash,
      ...updateClassDto,
    });

    if (!classUnit) {
      throw new NotFoundException(`No such classHash: №${classHash} found`);
    }

    return this.classRepo.save(classPreload);
  }

  async delete(classHash: string) {
    const classUnit = await this.findOne(classHash);
    return this.classRepo.remove(classUnit);
  }

  async addLesson(classHash: string, lessonHash: string) {
    const classUnit = await this.classRepo.findOne(
      {hash: classHash},
      { relations: ['lessons'] });
    const lesson = await this.lessonRepo.findOne({hash: lessonHash});
    if (!classUnit) {
      throw new BadRequestException(`No such classHash: №${classHash} found`);

    }

    if (!lesson) {
      throw new BadRequestException(`No such lessonHash: №${lessonHash} found`);

    }

    const lessonExist = classUnit.lessons.find(lesson => lesson.hash === lessonHash);
    if (lessonExist) {
      throw new BadRequestException(`LessonHash: №${lessonHash} already exists in classHash: №${classHash}`);
    }
    classUnit.lessons.push(lesson);

    return this.classRepo.save(classUnit);
  }

  async deleteLesson(classHash: string, lessonHash: string) {
    const classUnit = await this.classRepo.findOne(
      {hash: classHash},
      { relations: ['lessons'] }
      );
    if (!classUnit) {
      throw new BadRequestException(`No such classHash: №${classHash} found`);

    }

    const lesson = await this.lessonRepo.findOne({hash: lessonHash});
    if (!lesson) {
      throw new BadRequestException(`No such lessonHash: №${lessonHash} found`);

    }

    const lessonExists = classUnit.lessons.find(lesson => lesson.hash === lessonHash);
    if (!lessonExists) {
      throw new BadRequestException(`No such lessonHash: №${lessonHash} exist in classHash: №${classHash}`);

    }
    classUnit.lessons.splice(classUnit.lessons.indexOf(lesson), 1);


    return this.classRepo.save(classUnit);
  }

  async enroll(classHash: string, userHash: string) {
    const classUnit = await this.classRepo.findOne(
      {hash: classHash},
      { relations: ['students'] }
      );
    if (!classUnit) {
      throw new BadRequestException(`No such classHash: №${classHash} found`);

    }

    const student = await this.userRepo.findOne({hash: userHash});
    if (!student) {
      throw new BadRequestException(`No such studentHash: №${userHash} found`);

    }

    const studentExist = classUnit.students.find(student => student.hash === userHash);
    if (studentExist) {
      throw new BadRequestException(`StudentHash: №${userHash} is already enrolled in classHash: №${classHash}`);

    }
    classUnit.students.push(student);

    return this.classRepo.save(classUnit);
  }

  async expel(classHash: string, userHash: string) {
    const classUnit = await this.classRepo.findOne(
      {hash: classHash},
      { relations: ['students'] }
      );
    if (!classUnit) {
      throw new BadRequestException(`No such classHash: №${classHash} found`);

    }

    const student = await this.userRepo.findOne({hash: userHash});
    if (!student) {
      throw new BadRequestException(`No such studentHash: №${userHash} found`);

    }

    const studentExist = classUnit.students.find(student => student.hash === userHash);
    if (!studentExist) {
      throw new BadRequestException(`StudentHash: ${userHash} is already enrolled in classHash: ${classHash}`);

    }
    classUnit.students.splice(classUnit.students.indexOf(student), 1);

    return this.classRepo.save(classUnit);
  }
}
