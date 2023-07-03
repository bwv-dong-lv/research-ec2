import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class GroupRefactoring1688357648645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'group_leader_id',
            type: 'bigint',
          },
          {
            name: 'group_floor_number',
            type: 'int',
          },
          {
            name: 'created_date',
            type: 'date',
          },
          {
            name: 'updated_date',
            type: 'date',
          },
          {
            name: 'deleted_date',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('group');
  }
}
