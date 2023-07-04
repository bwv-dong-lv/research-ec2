"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRefactoring1688357634489 = void 0;
const typeorm_1 = require("typeorm");
class UserRefactoring1688357634489 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('user');
    }
}
exports.UserRefactoring1688357634489 = UserRefactoring1688357634489;
//# sourceMappingURL=1688357634489-UserRefactoring.js.map