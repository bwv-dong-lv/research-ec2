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
import {hashPassword} from '../utils/bcrypt';
import {cache} from 'ejs';
dayjs.extend(utc);
dayjs.extend(tz);
/**
 * GET user list
 */
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

export const renderUserList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
  const tempSession = {...req.session};

  req.session.flashMessage = '';
  req.session.searchInfo = '';

  if (tempSession.searchInfo === undefined || tempSession.searchInfo === '') {
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
      flashMessage: tempSession.flashMessage || '',
    });
  } else {
    const userRepository = getCustomRepository(UserRepository);
    const groupRepository = getCustomRepository(GroupRepository);

    const userListData = await userRepository.findUsers(
      tempSession.searchInfo.username,
      tempSession.searchInfo.fromDate &&
        convertDateFormat(tempSession.searchInfo.fromDate),
      tempSession.searchInfo.toDate &&
        convertDateFormat(tempSession.searchInfo.toDate),
      tempSession.searchInfo.page,
    );

    const groupList = await groupRepository.getAllGroup();

    userListData.data.forEach((user: any) => {
      user.position_name = UserRole[Number(user.position_id)];

      const group = groupList.find(group => group.id == user.group_id);
      user.group_name = group ? group.name : '';
      user.started_date_display = moment(user.started_date)
        .add(1, 'day')
        .format('DD/MM/YYYY');
    });

    const totalPage = Math.ceil(userListData.count / 10);
    let pageArray: any = [];

    if (totalPage < 6) {
      pageArray = _.range(1, totalPage + 1);
    } else {
      if (Number(tempSession.searchInfo.page) < 5) {
        pageArray = _.range(1, 6);
      }
      if (Number(tempSession.searchInfo.page) >= 5) {
        if (Number(tempSession.searchInfo.page <= totalPage - 4)) {
          pageArray = _.range(
            Number(tempSession.searchInfo.page),
            Number(tempSession.searchInfo.page) + 5,
          );
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
      username: tempSession.searchInfo.username,
      loginUser: req.session.user,
      userList: userListData.data,
      fromDate: tempSession.searchInfo.fromDate,
      toDate: tempSession.searchInfo.toDate,
      pageArray: pageArray,
      currentPage: tempSession.searchInfo.page,
      lastPage: fullPageArray.at(-1),
      totalRow: userListData.count,
      prev3dots: pageArray[0] > 1,
      next3dots: pageArray.at(-1) < (fullPageArray.at(-1) || 5),
      flashMessage: '',
    });
  }
};

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

  req.session.searchInfo = {
    username: req.body.username,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    page: req.body.page,
  };

  if (
    req.body.usernameOrigin != req.body.username ||
    req.body.fromDateOrigin != req.body.fromDate ||
    req.body.toDateOrigin != req.body.toDate
  ) {
    req.session.searchInfo.page = 1;
  }

  res.redirect('/user');
};

function getCurrentDateTimeString() {
  const currentDate = moment().utcOffset(7);

  const formattedDate = currentDate.format('YYYYMMDDHHmmss');

  const newFileName = 'list_user_' + formattedDate;

  return newFileName;
}

export const exportCSV = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const groupRepository = getCustomRepository(GroupRepository);

    const groupList = await groupRepository.getAllGroup();

    const userListCSVData = await userRepository.getAllUsers(
      req.session.search.username,
      req.session.search.fromDate &&
        convertDateFormat(req.session.search.fromDate),
      req.session.search.toDate && convertDateFormat(req.session.search.toDate),
    );

    const positionNameArr = ['Director', 'Group Leader', 'Leader', 'Member'];

    userListCSVData.data.forEach((user: any) => {
      user.position_name = positionNameArr[Number(user.position_id)];

      const group = groupList.find(group => group.id == user.group_id);
      user.group_name = group ? group.name : '';
      user.started_date_display = moment(user.started_date)
        .add(1, 'day')
        .format('DD/MM/YYYY');
      user.created_date_display = moment(user.created_date)
        .add(1, 'day')
        .format('DD/MM/YYYY');
      user.updated_date_display = moment(user.updated_date)
        .add(1, 'day')
        .format('DD/MM/YYYY');
    });

    const parser = new Parser();

    const usersDownload = userListCSVData.data?.map((item: any) => ({
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
    const filename = getCurrentDateTimeString();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.csv`,
    );
    res.status(200).end(csv);
  } catch (err) {
    console.error(err);
  }
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

  const userRepository = getCustomRepository(UserRepository);
  const groupRepository = getCustomRepository(GroupRepository);

  const groupList = await groupRepository.getAllGroup();

  const tempSession = {...req.session};

  req.session.flashMessage = '';

  // update user
  if (req.params.userId) {
    const userInfo: any = await userRepository.getUserById(
      Number(req.params.userId),
    );

    if (userInfo) {
      const group = await groupRepository.getGroupById(userInfo.group_id);

      userInfo.started_date = moment(userInfo.started_date)
        .add(1, 'day')
        .format('DD/MM/YYYY');

      userInfo.password = tempSession.updateUserInfo?.password || '';
      userInfo.email = tempSession.updateUserInfo?.email || userInfo.email;

      req.session.updateUserInfo = '';

      res.render('userEditDelete/index', {
        layout: 'layout/defaultLayout',
        pageTitle: 'User Update Delete',
        userInfo: userInfo,
        groupId: group?.id || -1,
        groupList: groupList,
        positionId: userInfo?.position_id,
        loginUser: req.session.user,
        flashMessage: tempSession.flashMessage ? tempSession.flashMessage : '',
      });
    }
  } else {
    req.session.addUserInfo = '';

    //add user
    res.render('userAdd/index', {
      layout: 'layout/defaultLayout',
      pageTitle: 'User Add',
      userInfo: tempSession.addUserInfo || '',
      groupId: tempSession.addUserInfo?.groupId || -1,
      groupList: groupList,
      positionId: tempSession.addUserInfo?.positionId || -1,
      loginUser: req.session.user,
      flashMessage: tempSession.flashMessage ? tempSession.flashMessage : '',
    });
  }
};

function stringToDate(inputString: string) {
  const dateParts = inputString.split('/');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 to convert to zero-based month
  const year = parseInt(dateParts[2], 10);

  return new Date(year, month, day);
}

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  const userRepository = getCustomRepository(UserRepository);

  if (await userRepository.getUserByEmail(req.body.email)) {
    // error email address is registed
    req.session.addUserInfo = {};

    req.session.addUserInfo = {
      id: req.body.id,
      email: req.body.email,
      name: req.body.username,
      password: req.body.password,
      started_date: req.body.startedDate,
      groupId: req.body.group,
      positionId: req.body.position,
    };

    req.session.flashMessage = messages.EBT019();
    res.redirect('/user/crud');
  } else {
    // create success
    const user: Partial<User> = {
      email: req.body.email,
      password: await hashPassword(req.body.password),
      name: req.body.username,
      group_id: Number(req.body.group),
      // started_date: new Date(req.body.startedDate),
      started_date: stringToDate(req.body.startedDate),
      position_id: req.body.position,
      created_date: new Date(),
      updated_date: new Date(),
    };

    try {
      await userRepository.createUser(user);

      req.session.flashMessage = messages.EBT096();
      res.redirect('/user/crud');
    } catch (error) {
      req.session.addUserInfo = {};

      req.session.addUserInfo = {
        id: req.body.id,
        email: req.body.email,
        name: req.body.username,
        password: req.body.password,
        started_date: req.body.startedDate,
        groupId: req.body.group,
        positionId: req.body.position,
      };

      req.session.flashMessage = messages.EBT093();
      res.redirect('/user/crud');
    }
  }
};

export const isSelfEmail = async (email: string, emailCheck: string) => {
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.getUserByEmail(email);
  const userCheck = await userRepository.getUserByEmail(emailCheck);

  if (user && userCheck && user.id === userCheck.id) {
    return true;
  }
  return false;
};

export const canEmailUpdate = async (email: string) => {
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.getUserByEmail(email);
  return user ? false : true;
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  const userRepository = getCustomRepository(UserRepository);
  const groupRepository = getCustomRepository(GroupRepository);

  const groupList = await groupRepository.getAllGroup();

  const userUpdate = await userRepository.getUserById(Number(req.body.userId));

  if (req.session.user?.id == req.body.userId) {
    const user: Partial<User> = {
      password: req.body.password
        ? await hashPassword(req.body.password)
        : undefined,
    };
    try {
      await userRepository.updateUser(Number(req.body.userId), user);

      req.session.updateUserInfo = {};

      req.session.updateUserInfo = {
        id: req.body.id,
        email: req.body.email,
        name: req.body.username,
        password: '',
        started_date: req.body.startedDate,
        groupId: req.body.group,
        positionId: req.body.position,
      };

      req.session.flashMessage = messages.EBT096();
      res.redirect(`/user/crud/${Number(req.body.userId)}`);
      return;
    } catch (error) {
      req.session.updateUserInfo = {};

      req.session.updateUserInfo = {
        id: req.body.id,
        email: req.body.email,
        name: req.body.username,
        password: req.body.password,
        started_date: req.body.startedDate,
        groupId: req.body.group,
        positionId: req.body.position,
      };

      req.session.flashMessage = messages.EBT093();
      res.redirect(`/user/crud/${Number(req.body.userId)}`);
    }
  }

  if (userUpdate) {
    if (await isSelfEmail(req.body.email, userUpdate?.email)) {
      // update giu nguyen email
      const parts = req.body.startedDate.split('/');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];

      // Format the date components into MySQL date format (YYYY-DD-MM)
      const mysqlDate = `${year}-${month}-${day}`;

      const user: Partial<User> = {
        password: req.body.password
          ? await hashPassword(req.body.password)
          : undefined,
        name: req.body.username,
        group_id: Number(req.body.group),
        started_date: new Date(mysqlDate),
        position_id: Number(req.body.position),
        updated_date: new Date(),
      };
      try {
        await userRepository.updateUser(Number(req.body.userId), user);

        req.session.updateUserInfo = {};

        req.session.updateUserInfo = {
          id: req.body.id,
          email: req.body.email,
          name: req.body.username,
          password: '',
          started_date: req.body.startedDate,
          groupId: req.body.group,
          positionId: req.body.position,
        };

        req.session.flashMessage = messages.EBT096();
        res.redirect(`/user/crud/${Number(req.body.userId)}`);
      } catch (error) {
        req.session.updateUserInfo = {};

        req.session.updateUserInfo = {
          id: req.body.id,
          email: req.body.email,
          name: req.body.username,
          password: req.body.password,
          started_date: req.body.startedDate,
          groupId: req.body.group,
          positionId: req.body.position,
        };

        req.session.flashMessage = messages.EBT093();
        res.redirect(`/user/crud/${Number(req.body.userId)}`);
      }
    } else {
      // update user with email
      if (await canEmailUpdate(req.body.email)) {
        // can update with email
        const parts = req.body.startedDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Format the date components into MySQL date format (YYYY-DD-MM)
        const mysqlDate = `${year}-${month}-${day}`;

        const user: Partial<User> = {
          email: req.body.email,
          password: req.body.password
            ? await hashPassword(req.body.password)
            : undefined,
          name: req.body.username,
          group_id: Number(req.body.group),
          started_date: new Date(mysqlDate),
          position_id: Number(req.body.position),
          updated_date: new Date(),
        };
        try {
          await userRepository.updateUser(Number(req.body.userId), user);

          req.session.updateUserInfo = {};

          req.session.updateUserInfo = {
            id: req.body.id,
            email: req.body.email,
            name: req.body.username,
            password: '',
            started_date: req.body.startedDate,
            groupId: req.body.group,
            positionId: req.body.position,
          };

          req.session.flashMessage = messages.EBT096();
          res.redirect(`/user/crud/${Number(req.body.userId)}`);
        } catch (error) {
          req.session.updateUserInfo = {};

          req.session.updateUserInfo = {
            id: req.body.id,
            email: req.body.email,
            name: req.body.username,
            password: req.body.password,
            started_date: req.body.startedDate,
            groupId: req.body.group,
            positionId: req.body.position,
          };

          req.session.flashMessage = messages.EBT093();
          res.redirect(`/user/crud/${Number(req.body.userId)}`);
        }
      } else {
        req.session.updateUserInfo = {};

        req.session.updateUserInfo = {
          id: req.body.id,
          email: req.body.email,
          name: req.body.username,
          password: req.body.password,
          started_date: req.body.startedDate,
          groupId: req.body.group,
          positionId: req.body.position,
        };

        req.session.flashMessage = messages.EBT019();
        res.redirect(`/user/crud/${Number(req.body.userId)}`);
      }
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  const userRepository = getCustomRepository(UserRepository);
  const groupRepository = getCustomRepository(GroupRepository);

  const groupList = await groupRepository.getAllGroup();

  try {
    await userRepository.deleteUserById(Number(req.body.userId), new Date());

    // res.render('userList/index', {
    //   layout: 'layout/defaultLayout',
    //   pageTitle: 'User List',
    //   usernameHeader: req.session.user?.name,
    //   username: '',
    //   loginUser: req.session.user,
    //   userList: [],
    //   fromDate: '',
    //   toDate: '',
    //   pageArray: [],
    //   currentPage: 1,
    //   lastPage: 0,
    //   totalRow: -1,
    //   prev3dots: false,
    //   next3dots: false,
    //   flashMessage: messages.EBT096(),
    // });
    req.session.flashMessage = messages.EBT096();
    res.redirect('/user');
  } catch (error) {
    req.session.updateUserInfo = {};

    req.session.updateUserInfo = {
      id: req.body.id,
      email: req.body.email,
      name: req.body.username,
      password: req.body.password,
      started_date: req.body.startedDate,
      groupId: req.body.group,
      positionId: req.body.position,
    };

    req.session.flashMessage = messages.EBT093();
    res.redirect(`/user/crud/${Number(req.body.userId)}`);
  }
};
