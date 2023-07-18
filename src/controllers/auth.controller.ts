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
  res.render('login/index', {
    layout: 'layout/loginLayout',
    form: {
      email: '',
      password: '',
    },
    flashMessage: '',
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

    if (user && (await comparePassword(req.body.password, user.password))) {
      req.session.user = user;
      res.redirect('/user');
    } else {
      res.render('login/index', {
        layout: 'layout/loginLayout',
        form: {
          email: email,
          password: password,
        },
        flashMessage: messages.EBT016(),
      });
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
