/* eslint-disable @typescript-eslint/camelcase */
import {format} from 'winston';
/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * User controller
 */
import {Request, Response, NextFunction} from 'express';

import {User} from '../entities/user.entity';
import _ from 'lodash';

import moment from 'moment';
import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';
import {} from '../utils/common';
import {messages} from '../constants';
import {GroupRepository} from '../repositories/group.repository';
import dayjs from 'dayjs';

/**
 * GET group
 */
export const renderGroupList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  res.render('groupList/index', {
    layout: 'layout/defaultLayout',
    pageTitle: 'Group List',
    usernameHeader: req.session.user?.name,
    username: '',
    loginUser: req.session.user,
    userList: [],
    fromDate: '',
    toDate: '',
    pageArray: [],
    currentPage: 1,
    lastPage: 0,
    totalRow: 0,
    flashMessage: '',
  });
};
