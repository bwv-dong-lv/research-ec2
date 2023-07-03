import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class UserRefactoring1688357634489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'group_id',
            type: 'bigint',
          },
          {
            name: 'started_date',
            type: 'date',
          },
          {
            name: 'position_id',
            type: 'tinyint',
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
    await queryRunner.dropTable('user');
  }
}
