/* eslint-disable @typescript-eslint/camelcase */
import {
  Between,
  EntityRepository,
  In,
  IsNull,
  LessThan,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import user from '../middlewares/user';
import {Group} from '../entities/group.entity';

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

  // deleteUserById = async (userId: number, adminId: number, date: Date) => {
  //   return await this.update(userId, {
  //     del_flg: 1,
  //     deleted_by: adminId,
  //     deleted_at: date,
  //   });
  // };

  getGroupById = async (groupId: number) => {
    return await this.findOne({id: groupId});
  };

  getAllGroup = async () => {
    const groups = await this.find({deleted_date: IsNull()});
    return groups;
  };
}
