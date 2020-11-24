import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";
import {Lesson} from "../../../entities/lesson.entity";

@Entity()
export class Video {

  @ApiHideProperty()
  @PrimaryGeneratedColumn("uuid")
  hash: string;

  @Column()
  @ApiProperty({ example: 'Node.js introduction'})
  title: string;

  @Column()
  @ApiProperty({example: '1'})
  order: number;

  @Column()
  @ApiProperty({example: 'https://lectrum.io/keynotes/lesson-1'})
  uri: string;

  @ManyToMany(
    () => Lesson,
    (lesson: Lesson) => lesson.contentVideos,
  )
  lessons: Lesson[];
}