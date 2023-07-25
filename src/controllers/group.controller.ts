import {IsNull} from 'typeorm';
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * User controller
 */
import {Request, Response, NextFunction} from 'express';
import Decimal from 'decimal.js';
import _ from 'lodash';
import fs from 'fs';

import moment from 'moment';
import {getConnection, getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';
import {} from '../utils/common';
import {messages} from '../constants';
import {GroupRepository} from '../repositories/group.repository';
import csvParser from 'csv-parser';
import {Group} from '../entities/group.entity';
import path from 'path';
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

  const tempSession = {...req.session};
  req.session.groupPage = '';
  req.session.flashMessage = '';
  req.session.flashMessageCSV = '';
  req.session.flashMessageInfo = '';

  const userRepository = getCustomRepository(UserRepository);
  const groupRepository = getCustomRepository(GroupRepository);

  const groupListData = await groupRepository.getGroups(
    tempSession.groupPage || 1,
  );

  const abc = [];

  for (let i = 0; i < groupListData.data.length; i++) {
    const leader = await userRepository.getExistUserById(
      groupListData.data[i].group_leader_id,
    );

    abc.push({
      ...groupListData.data[i],
      group_leader_name: leader?.name || '',
      created_date_display: moment(groupListData.data[i].created_date)
        .add(1, 'day')
        .format('DD/MM/YYYY'),

      updated_date_display: moment(groupListData.data[i].updated_date)
        .add(1, 'day')
        .format('DD/MM/YYYY'),

      deleted_date_display: groupListData.data[i].deleted_date
        ? moment(groupListData.data[i].deleted_date)
            .add(1, 'day')
            .format('DD/MM/YYYY')
        : '',
    });
  }

  const totalPage = Math.ceil(groupListData.count / 10);

  let pageArray: any = [];

  if (totalPage < 6) {
    pageArray = _.range(1, totalPage + 1);
  } else {
    if ((tempSession.groupPage || 1) < 5) {
      pageArray = _.range(1, 6);
    }
    if ((tempSession.groupPage || 1) >= 5) {
      if ((tempSession.groupPage || 1) <= totalPage - 4) {
        pageArray = _.range(
          tempSession.groupPage || 1,
          (tempSession.groupPage || 1) + 5,
        );
        console.log('hello');
      } else {
        pageArray = _.range(totalPage - 4, totalPage + 1);
      }
    }
  }

  const fullPageArray = _.range(1, totalPage + 1);

  req.session.flashMessage = '';

  res.render('groupList/index', {
    layout: 'layout/defaultLayout',
    pageTitle: 'Group List',
    usernameHeader: req.session.user?.name,
    loginUser: req.session.user,
    groupList: abc,
    pageArray: pageArray,
    currentPage: tempSession.groupPage || 1,
    lastPage: fullPageArray.at(-1),
    totalRow: groupListData.count,
    prev3dots: pageArray[0] > 1,
    next3dots: pageArray.at(-1) < (fullPageArray.at(-1) || 5),
    flashMessage: tempSession.flashMessage || '',
    flashMessageCSV: tempSession.flashMessageCSV || '',
    flashMessageInfo: tempSession.flashMessageInfo || '',
  });
};

export const postGroupList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  req.session.groupPage = Number(req.body.page);
  res.redirect('/group');
};

export const isNumeric = (value: string) => {
  const parsedNumber = Number(value);
  return !isNaN(parsedNumber) && Number.isInteger(parsedNumber);
};

export const checkHeaderCSV = async (headerName: string[]) => {
  return (
    JSON.stringify(headerName) ===
    JSON.stringify([
      'ID',
      'Group Name',
      'Group Note',
      'Group Leader',
      'Floor Number',
      'Delete',
    ])
  );
};

export const checkRequiredCSV = async (
  errorTextArr: string[],
  row: any,
  rowNumber: number,
) => {
  if (row['Delete'] != 'Y' && !row['ID'] && !row['Group Name']) {
    errorTextArr.push(
      messages.messageCSV(rowNumber, messages.EBT001('Group Name')),
    );
  }
  if (row['Delete'] != 'Y' && !row['ID'] && !row['Group Leader']) {
    errorTextArr.push(
      messages.messageCSV(rowNumber, messages.EBT001('Group Leader')),
    );
  }
  if (row['Delete'] != 'Y' && !row['ID'] && !row['Floor Number']) {
    errorTextArr.push(
      messages.messageCSV(rowNumber, messages.EBT001('Floor Number')),
    );
  }
};

export const checkFormatCSV = async (
  errorTextArr: string[],
  row: any,
  rowNumber: number,
) => {
  if (row['ID'] && !isNumeric(row['ID'])) {
    errorTextArr.push(messages.messageCSV(rowNumber, messages.EBT010('ID')));
  }
  if (row['Group Leader'] && !isNumeric(row['Group Leader'])) {
    errorTextArr.push(
      messages.messageCSV(rowNumber, messages.EBT010('Group Leader')),
    );
  }
  if (row['Floor Number'] && !isNumeric(row['Floor Number'])) {
    errorTextArr.push(
      messages.messageCSV(rowNumber, messages.EBT010('Floor Number')),
    );
  }
};

export const checkMaxLengthCSV = async (
  errorTextArr: string[],
  row: any,
  rowNumber: number,
) => {
  if (row['Group Name'] && row['Group Name'].length > 255) {
    errorTextArr.push(
      messages.messageCSV(
        rowNumber,
        messages.EBT002('Group Name', 255, row['Group Name'].length),
      ),
    );
  }

  if (row['ID'] && row['ID'].length > 19) {
    errorTextArr.push(
      messages.messageCSV(
        rowNumber,
        messages.EBT002('ID', 19, row['ID'].length),
      ),
    );
  }

  if (row['Group Leader'] && row['Group Leader'].length > 19) {
    errorTextArr.push(
      messages.messageCSV(
        rowNumber,
        messages.EBT002('Group Leader', 19, row['Group Leader'].length),
      ),
    );
  }

  if (row['Floor Number'] && row['Floor Number'].length > 9) {
    errorTextArr.push(
      messages.messageCSV(
        rowNumber,
        messages.EBT002('Floor Number', 9, row['Floor Number'].length),
      ),
    );
  }
};

export const importCSV = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const userRepository = getCustomRepository(UserRepository);

  if (req.session.user?.id) {
    const loginUser = await userRepository.getUserById(req.session.user.id);
    if (loginUser?.position_id !== 0) {
      req.session.destroy(function() {});
      res.redirect('/login');
      return;
    }
  }

  try {
    if (!req.file) {
      console.log('missing file');
    }

    const results: any = [];
    let headerCSV: any = [];

    const groupRepository = getCustomRepository(GroupRepository);
    const userRepository = getCustomRepository(UserRepository);

    const filePath = path.join(__dirname, '../../', req.file.path);

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', data => {
        results.push(data);
      })
      .on('headers', async headers => {
        headerCSV = headers;
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path);

        const errorTextArr: string[] = [];

        if (await checkHeaderCSV(headerCSV)) {
          if (results.length === 0) {
            req.session.flashMessage = messages.EBT095();
            res.redirect('/group');
            return;
          }

          for (let i = 0; i < results.length; i++) {
            const row = results[i];

            checkRequiredCSV(errorTextArr, row, i);

            checkFormatCSV(errorTextArr, row, i);

            checkMaxLengthCSV(errorTextArr, row, i);

            if (
              row['ID'] &&
              isNumeric(row['ID']) &&
              Number(row['ID']).toString().length <= 19
            ) {
              const existGroup = await groupRepository.getGroupById(row['ID']);

              if (!existGroup) {
                errorTextArr.push(
                  messages.messageCSV(i, messages.EBT094(row['ID'].toString())),
                );
              }
            }

            if (
              row['Group Leader'] &&
              isNumeric(row['Group Leader']) &&
              Number(row['Group Leader']).toString().length <= 19
            ) {
              const existGroup = await userRepository.checkUserExist(
                row['Group Leader'],
              );

              if (!existGroup) {
                errorTextArr.push(
                  messages.messageCSV(
                    i,
                    messages.EBT094(row['Group Leader'].toString()),
                  ),
                );
              }
            }
          }
        } else {
          req.session.flashMessage = messages.EBT095();
          res.redirect('/group');
          return;
        }

        // can import csv
        if (
          !errorTextArr ||
          (Array.isArray(errorTextArr) && errorTextArr.length === 0)
        ) {
          try {
            await getConnection().transaction(
              async transactionalEntityManager => {
                for (const row of results) {
                  if (row['ID']) {
                    if (row['Delete'] == 'Y') {
                      //delete group
                      const deleteGroup = {
                        deleted_date: new Date(),
                      };
                      await transactionalEntityManager.update(
                        Group,
                        row['ID'],
                        deleteGroup,
                      );
                    } else {
                      //update group
                      const updateGroup: any = {};

                      if (row['Group Name']) {
                        updateGroup.name = row['Group Name'];
                        updateGroup.updated_date = new Date();
                      }
                      if (row['Group Note']) {
                        updateGroup.note = row['Group Note'];
                        updateGroup.updated_date = new Date();
                      }
                      if (row['Group Leader']) {
                        updateGroup.group_leader_id = row['Group Leader'];
                        updateGroup.updated_date = new Date();
                      }
                      if (row['Floor Number']) {
                        updateGroup.group_floor_number = row['Floor Number'];
                        updateGroup.updated_date = new Date();
                      }

                      if (updateGroup) {
                        await transactionalEntityManager.update(
                          Group,
                          row['ID'],
                          updateGroup,
                        );
                      }
                    }
                  } else {
                    //create group
                    const insertGroup = {
                      name: row['Group Name'],
                      note: row['Group Note'],
                      group_leader_id: row['Group Leader'],
                      group_floor_number: row['Floor Number'],
                      created_date: new Date(),
                      updated_date: new Date(),
                    };
                    await transactionalEntityManager.insert(Group, insertGroup);
                  }
                }
              },
            );

            req.session.flashMessageInfo = messages.EBT092();
            res.redirect('/group');
          } catch (error) {
            console.log('error: ', error);
          }
        } else {
          req.session.flashMessageCSV = errorTextArr;
          res.redirect('/group');
        }
      });
  } catch (error) {
    console.log('error: ', error);
  }
};
