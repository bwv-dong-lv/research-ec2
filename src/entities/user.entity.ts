import {Entity, Column, ManyToOne} from 'typeorm';
import {BaseEntity} from './base.entity';
import {Group} from './group.entity';

export enum UserRole {
  DIRECTOR = 0,
  GROUPLEADER = 1,
  LEADER = 2,
  MEMBER = 3,
}

/**
 * Model definition
 */
@Entity({
  name: 'user',
  synchronize: false,
})
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'bigint',
  })
  group_id: number;

  @Column({
    type: 'date',
  })
  started_date: Date;

  @Column({
    type: 'tinyint',
  })
  position_id: number;
}
