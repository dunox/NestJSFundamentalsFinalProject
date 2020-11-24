import {Column, Entity, PrimaryGeneratedColumn, Index, JoinTable, ManyToMany} from 'typeorm';
import {Class} from "../../classes/entities/class.entity";
import {ApiHideProperty, ApiProperty} from "@nestjs/swagger";
import {sexEnum} from "../unem/sex.enum";
import {roleEnum} from "../unem/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiHideProperty()
  id: number;

  @PrimaryGeneratedColumn("uuid")
  @Column({ unique: true })
  @ApiHideProperty()
  hash: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'jdoe@example.com' })
  @Index()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '+380662332377' })
  @Column()
  @ApiProperty({ example: '+380662332377' })
  phone: string;

  @ApiProperty({ example: 'ab12345Cd' })
  @Column()
  password: string;

  @ApiProperty({ example: 'm' })
  @Column({
    type: "enum",
    enum: sexEnum,
  })
  sex: sexEnum;

  @ApiProperty({ example: 'newbie' })
  @Column({
    type: "enum",
    enum: roleEnum,
    nullable: true
  })
  role: roleEnum;

  @ApiHideProperty()
  @ManyToMany(
    type => Class,
    classEntity => classEntity.students,
  )
  classes: Class[];
}