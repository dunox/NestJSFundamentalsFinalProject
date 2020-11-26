import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Content} from "./content.entity";
import {Class} from "../../classes/entities/class.entity";
import {ApiHideProperty} from "@nestjs/swagger";
import {Video} from "../content/videos/entities/video.entity";
import {Keynote} from "../content/keynotes/entities/keynote.entity";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @PrimaryGeneratedColumn("uuid")
    hash: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    // @Column(() => Content)
    // content: Content = new Content();

    @JoinTable()
    @ManyToMany(
      type => Video,
      (video: Video) => video.lessons
    )
    videos: Video[];

    @JoinTable()
    @ManyToMany(
      () => Keynote,
      (keynote: Keynote) => keynote.lessons,
    )
    keynotes: Keynote[];
    @ApiHideProperty()
    @ManyToOne(
      () => Class,
        classUnit => classUnit.lessons,
    )
    classes: Class[];
}