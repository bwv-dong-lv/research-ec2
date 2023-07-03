import {Column, PrimaryGeneratedColumn} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', {type: 'bigint'})
  id: number;

  @Column('date', {})
  created_date: Date;

  @Column('date', {})
  updated_date: Date;

  @Column('date', {
    nullable: true,
  })
  deleted_date: Date;
}
