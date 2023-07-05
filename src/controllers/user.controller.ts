import {formatDate} from './../utils/common';
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

import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import {time} from 'console';
dayjs.extend(utc);
dayjs.extend(tz);
/**
 * GET user list
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
    pageTitle: 'User List',
    usernameHeader: req.session.user?.name,
    username: '',
    loginUser: req.session.user,
    userList: [],
    fromDate: '',
    toDate: '',
    pageArray: [],
    currentPage: 1,
    lastPage: 0,
    totalRow: -1,
    prev3dots: false,
    next3dots: false,
    flashMessage: '',
  });
};

function convertDateFormat(dateString: any) {
  const parts = dateString.split('/');
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  // Create a new Date object with the given date components
  const date = new Date(year, month - 1, day);

  // Extract the year, month, and day from the Date object
  const convertedYear = date.getFullYear();
  const convertedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
  const convertedDay = ('0' + date.getDate()).slice(-2);

  // Return the converted date in the format yyyy-mm-dd
  return convertedYear + '-' + convertedMonth + '-' + convertedDay;
}

/**
 * POST user list
 */
export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  console.log(dayjs(req.body.fromDate).isBefore(dayjs(req.body.toDate)));

  if (req.body.fromDate && req.body.toDate) {
    if (!dayjs(req.body.fromDate).isBefore(dayjs(req.body.toDate))) {
      res.render('userList/index', {
        layout: 'layout/defaultLayout',
        pageTitle: 'User List',
        usernameHeader: req.session.user?.name,
        username: req.body.username,
        loginUser: req.session.user,
        userList: [],
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        pageArray: [],
        currentPage: 1,
        lastPage: 0,
        totalRow: -1,
        prev3dots: false,
        next3dots: false,
        flashMessage: messages.EBT044(),
      });
    }
  }

  const userRepository = getCustomRepository(UserRepository);
  const groupRepository = getCustomRepository(GroupRepository);

  const userListData = await userRepository.findUsers(
    req.body.username,
    req.body.fromDate && convertDateFormat(req.body.fromDate),
    req.body.toDate && convertDateFormat(req.body.toDate),
    req.body.page,
  );

  const groupList = await groupRepository.getAllGroup();

  userListData.data.forEach((user: any) => {
    user.position_name = UserRole[Number(user.position_id)];

    const group = groupList.find(group => group.id == user.group_id);
    user.group_name = group ? group.name : '';
    user.started_date_display = dayjs(user.started_date).format('DD/MM/YYYY');
  });

  const userListCSVData = await userRepository.getAllUsers(
    req.body.username,
    req.body.fromDate && convertDateFormat(req.body.fromDate),
    req.body.toDate && convertDateFormat(req.body.toDate),
  );

  const positionNameArr = ['Director', 'Group Leader', 'Leader', 'Member'];

  userListCSVData.data.forEach((user: any) => {
    user.position_name = positionNameArr[Number(user.position_id)];

    const group = groupList.find(group => group.id == user.group_id);
    user.group_name = group ? group.name : '';
    user.started_date_display = dayjs
      .utc(user.started_date)
      .format('DD/MM/YYYY');
    user.created_date_display = dayjs(user.created_date).format('DD/MM/YYYY');
    user.updated_date_display = dayjs(user.updated_date).format('DD/MM/YYYY');
  });

  req.session.userListCSV = userListCSVData.data;

  const totalPage = Math.ceil(userListData.count / 10);
  let pageArray: any = [];

  if (totalPage < 6) {
    pageArray = _.range(1, totalPage + 1);
  } else {
    if (Number(req.body.page) < 5) {
      pageArray = _.range(1, 6);
    }
    if (Number(req.body.page) >= 5) {
      if (Number(req.body.page <= totalPage - 4)) {
        pageArray = _.range(Number(req.body.page), Number(req.body.page) + 5);
      } else {
        pageArray = _.range(Number(totalPage - 4), totalPage + 1);
      }
    }
  }

  const fullPageArray = _.range(1, totalPage + 1);

  res.render('userList/index', {
    layout: 'layout/defaultLayout',
    pageTitle: 'User List',
    usernameHeader: req.session.user?.name,
    username: req.body.username,
    loginUser: req.session.user,
    userList: userListData.data,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    pageArray: pageArray,
    currentPage: req.body.page,
    lastPage: fullPageArray.at(-1),
    totalRow: userListData.count,
    prev3dots: pageArray[0] > 1,
    next3dots: pageArray.at(-1) < (fullPageArray.at(-1) || 5),
    flashMessage: '',
  });
};

/**
 * GET user add edit delete
 */
export const renderUserAddEditDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  res.render('userAddEditDelete/index', {
    layout: 'layout/defaultLayout',
    pageTitle: 'UserAddEditDelete',
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

export const exportCSV = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parser = new Parser();
    const usersDownload = req.session.userListCSV?.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      email: item.email,
      group_id: item.group_id,
      group_name: item.group_name,
      started_date: item.started_date_display.toString(),
      position: item.position_name,
      created_date:
        item.created_date_display && item.created_date_display.toString(),
      updated_date:
        item.updated_date_display && item.updated_date_display.toString(),
    }));

    const fields = [
      {label: 'ID', value: 'id'},
      {label: 'User\u00A0Name', value: 'name'},
      {label: 'Email', value: 'email'},
      {label: 'Group\u00A0ID', value: 'group_id'},
      {label: 'Group\u00A0Name', value: 'group_name'},
      {label: 'Started\u00A0Date', value: 'started_date'},
      {label: 'Position', value: 'position'},
      {label: 'Created\u00A0Date', value: 'created_date'},
      {label: 'Updated\u00A0Date', value: 'updated_date'},
    ];

    const json2csvParser = new Parser({fields, withBOM: true});
    const csv = json2csvParser.parse(usersDownload);

    // const csv = parser.parse(usersDownload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.status(200).end(csv);
  } catch (err) {
    console.error(err);
  }
};
