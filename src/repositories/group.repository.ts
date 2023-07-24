/* eslint-disable @typescript-eslint/camelcase */
import {EntityRepository, IsNull, Repository} from 'typeorm';
import user from '../middlewares/user';
import {Group} from '../entities/group.entity';
import Decimal from 'decimal.js';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  // CRUD
  createGroup = async (group: Partial<Group>) => {
    return await this.save(group);
  };

  updateGroup = async (groupId: number, group: Partial<Group>) => {
    const property = await this.findOne({
      where: {id: groupId},
    });

    return this.save({
      ...property, // existing fields
      ...user, // updated fields
    });
  };

  getGroupById = async (groupId: number) => {
    return await this.findOne({where: {id: groupId, deleted_date: IsNull()}});
  };

  getAllGroup = async () => {
    const groups = await this.find({
      where: {
        deleted_date: IsNull(),
      },
      order: {
        name: 'ASC',
      },
    });
    return groups;
  };

  getAllGroupNull = async () => {
    const [result, total] = await this.findAndCount({});
    return {
      data: result,
      count: total,
    };
  };

  getGroups = async (page: number) => {
    const [result, total] = await this.findAndCount({
      order: {
        id: 'DESC',
      },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return {
      data: result,
      count: total,
    };
  };

  deleteGroupById = async (groupId: number) => {
    return await this.update(groupId, {
      deleted_date: new Date(),
    });
  };
}
