/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * User controller
 */
import {Request, Response, NextFunction} from 'express';

import _ from 'lodash';

import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';

import {messages} from '../constants';
import {comparePassword} from '../utils/bcrypt';

/**
 * GET login
 */
export const renderLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tempSession = {...req.session};
  req.session.flashMessage = '';
  req.session.loginInfo = '';

  res.render('login/index', {
    layout: 'layout/loginLayout',
    form: {
      email: tempSession.loginInfo?.email || '',
      password: tempSession.loginInfo?.password || '',
    },
    flashMessage: tempSession.flashMessage || '',
  });
};

/**
 * POST login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const {email, password} = req.body;

    const user = await userRepository.getUserByEmail(req.body.email);
    const users: any = await userRepository.getUsersNotNullByEmail(
      req.body.email,
    );
    // const users: any = await userRepository.getUsersByEmail(req.body.email);

    if (
      users.length === 1 &&
      user &&
      (await comparePassword(req.body.password, user.password))
    ) {
      req.session.user = user;
      res.redirect('/user');
    } else {
      req.session.loginInfo = {};

      req.session.loginInfo = {
        email: email,
        password: password,
      };

      req.session.flashMessage = messages.EBT016();

      res.redirect('/login');
    }
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.session.destroy(function(err) {});

  const redirectURL = '/login';
  res.redirect(redirectURL);
};
