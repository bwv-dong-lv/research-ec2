/* eslint-disable @typescript-eslint/camelcase */
import {format} from 'winston';
/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * User controller
 */
import {Request, Response, NextFunction} from 'express';

import {User, UserRole} from '../entities/user.entity';
import _ from 'lodash';
import {Parser} from '@json2csv/plainjs';
import moment from 'moment';
import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';
import {} from '../utils/common';
import {messages} from '../constants';
import {GroupRepository} from '../repositories/group.repository';
import dayjs from 'dayjs';
import {hashPassword} from '../utils/bcrypt';

/**
 * GET user list
 */
export const test = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = getCustomRepository(UserRepository);

  // for (let i = 77; i <= 100; i++) {
  //   const user: Partial<User> = {
  //     email: `dong${i}@yahoo.com`,
  //     password: await hashPassword(`dong${i}`),
  //     name: `dong lun${i}`,
  //     group_id: 1,
  //     started_date: new Date(),
  //     position_id: 3,
  //     created_date: new Date(),
  //     updated_date: new Date(),
  //   };

  //   try {
  //     await userRepository.createUser(user);
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // }
};
