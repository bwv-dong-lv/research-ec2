/* eslint-disable @typescript-eslint/camelcase */
import {EntityRepository, In, Like, Repository} from 'typeorm';
import {User} from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createUser = async (user: Partial<User>) => {
    return await this.save(user);
  };

  getUserByEmail = async (userEmail: string) => {
    return await this.findOne({email: userEmail});
  };

  getUserById = async (userId: number) => {
    return await this.findOne({id: userId});
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

  getAllUsers = async (email: any, name: any, user_flg: any, phone: any) => {
    const isMultiUserType = Array.isArray(user_flg);

    const whereClause: any = {
      name: Like(`%${name ? name : ''}%`),
      user_flg: isMultiUserType ? In(user_flg) : user_flg,
      del_flg: 0,
    };

    if (email) {
      whereClause.email = email;
    }

    if (phone) {
      whereClause.phone = phone;
    }

    const [result, total] = await this.findAndCount({
      where: whereClause,
    });

    return {
      data: result,
      count: total,
    };
  };

  findUsers = async (
    email: any,
    name: any,
    user_flg: any,
    date_of_birth: Date,
    phone: any,
    page: any,
  ) => {
    const isMultiUserType = Array.isArray(user_flg);

    const whereClause: any = {
      name: Like(`%${name ? name : ''}%`),
      user_flg: isMultiUserType ? In(user_flg) : user_flg,
      del_flg: 0,
    };

    if (email) {
      whereClause.email = email;
    }

    if (phone) {
      whereClause.phone = phone;
    }

    const [result, total] = await this.findAndCount({
      where: whereClause,
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return {
      data: result,
      count: total,
    };
  };

  // deleteUserById = async (userId: number, adminId: number, date: Date) => {
  //   return await this.update(userId, {
  //     del_flg: 1,
  //     deleted_by: adminId,
  //     deleted_at: date,
  //   });
  // };

  isEmailInvalid = async (email: string) => {
    const user = await this.getUserByEmail(email);
    return user ? true : false;
  };
}
