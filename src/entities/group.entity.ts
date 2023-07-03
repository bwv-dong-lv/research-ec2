import {Entity, Column} from 'typeorm';
import {BaseEntity} from './base.entity';

/**
 * Model definition
 */
@Entity({
  name: 'group',
  synchronize: false,
})
export class Group extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    name: 'note',
    nullable: true,
  })
  note: string;

  @Column({
    type: 'bigint',
    name: 'group_leader_id',
  })
  group_leader_id: number;

  @Column({
    type: 'int',
    name: 'group_floor_number',
  })
  group_floor_number: number;
}
