import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany
} from 'typeorm';
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";
import {Lesson} from "../../lessons/entities/lesson.entity";
import {User} from "../../users/entity/user.entity";

class Duration {
  started: Date;
  closed: Date;
}

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  @ApiHideProperty()
  id: number;

  @Column()
  @PrimaryGeneratedColumn("uuid")
  @ApiHideProperty()
  hash: string;

  @Column()
  @ApiProperty({ example: 'Backend' })
  title: string;

  @Column()
  @ApiProperty({ example: 'Backend Online Course' })
  description: string;

  @Column()
  @ApiProperty({ example: '2' })
  order: number;

  @Column(() => Duration )
  duration: Duration = new Duration();

  @JoinTable({name: 'students_to_classes'})
  @ManyToMany(
    () => User,
    user => user.classes,
  )
  @ApiHideProperty()
  students: User[];

  @JoinTable({name: 'lessons_to_classes'})
  @ManyToMany(
    () => Lesson,
    lesson => lesson.classes,
  )
  lessons: Lesson[];
}