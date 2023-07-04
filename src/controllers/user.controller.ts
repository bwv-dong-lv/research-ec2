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

/**
 * GET user add
 */
export const renderUserList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  res.render('userList/index', {
    layout: 'layout/defaultLayout',
    username: req.session.user?.name,
    email: '',
    name: '',
    password: '',
    rePassword: '',
    userFlag: 'user',
    birthday: '',
    phone: '',
    address: '',
    errorMessage: '',
  });
};
