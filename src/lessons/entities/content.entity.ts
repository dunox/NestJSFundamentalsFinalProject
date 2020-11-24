import { JoinTable, ManyToMany } from 'typeorm';
import {Video} from "../content/videos/entities/video.entity";
import {Keynote} from "../content/keynotes/entities/keynote.entity";

export class Content {
  @ManyToMany(() => Video)
  @JoinTable()
  videos: Video[];

  @ManyToMany(() => Keynote)
  @JoinTable()
  keynotes: Keynote[];
}