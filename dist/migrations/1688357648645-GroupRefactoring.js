"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRefactoring1688357648645 = void 0;
const typeorm_1 = require("typeorm");
class GroupRefactoring1688357648645 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('group');
    }
}
exports.GroupRefactoring1688357648645 = GroupRefactoring1688357648645;
//# sourceMappingURL=1688357648645-GroupRefactoring.js.map