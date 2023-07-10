/* eslint-disable @typescript-eslint/camelcase */
import {
  Between,
  EntityRepository,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {User} from '../entities/user.entity';
import user from '../middlewares/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // CRUD
  createUser = async (user: Partial<User>) => {
    return await this.save(user);
  };

  updateUser = async (userId: number, user: Partial<User>) => {
    const property = await this.findOne({
      where: {id: userId},
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

  getUserByEmail = async (userEmail: string) => {
    return await this.findOne({email: userEmail});
  };

  getUserById = async (userId: number) => {
    return await this.findOne({id: userId});
  };

  getAllUsers = async (username: string, fromDate: Date, toDate: Date) => {
    const whereClause: any = {
      name: Like(`%${username ? username : ''}%`),
      deleted_date: IsNull(),
    };

    if (fromDate && toDate) {
      whereClause.started_date = Between(fromDate, toDate);
      if (fromDate == toDate) {
        whereClause.started_date = fromDate;
      }
    } else {
      if (fromDate) {
        whereClause.started_date = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereClause.started_date = LessThanOrEqual(toDate);
      } else if (fromDate == toDate) {
      }
    }

    const [result, total] = await this.findAndCount({
      where: whereClause,
      order: {
        name: 'ASC',
        started_date: 'ASC',
        id: 'ASC',
      },
    });

    return {
      data: result,
      count: total,
    };
  };

  findUsers = async (
    username: string,
    fromDate: Date | undefined | string,
    toDate: Date | undefined | string,
    page: number,
  ) => {
    const whereClause: any = {
      name: Like(`%${username ? username : ''}%`),
      deleted_date: IsNull(),
    };

    if (fromDate && toDate) {
      whereClause.started_date = Between(fromDate, toDate);
    } else {
      if (fromDate) {
        whereClause.started_date = MoreThanOrEqual(fromDate);
      } else if (toDate) {
        whereClause.started_date = LessThanOrEqual(toDate);
      } else {
      }
    }

    const [result, total] = await this.findAndCount({
      where: whereClause,
      order: {
        name: 'ASC',
        started_date: 'ASC',
        id: 'ASC',
      },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return {
      data: result,
      count: total,
    };
  };

  isEmailInvalid = async (email: string) => {
    const user = await this.getUserByEmail(email);
    return user ? true : false;
  };
}
