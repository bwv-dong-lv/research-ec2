"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCSV = exports.checkMaxLengthCSV = exports.checkFormatCSV = exports.checkRequiredCSV = exports.checkHeaderCSV = exports.isNumeric = exports.postGroupList = exports.renderGroupList = void 0;
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
const constants_1 = require("../constants");
const group_repository_1 = require("../repositories/group.repository");
const csv_parser_1 = __importDefault(require("csv-parser"));
const group_entity_1 = require("../entities/group.entity");
const path_1 = __importDefault(require("path"));
/**
 * GET group
 */
const renderGroupList = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const tempSession = Object.assign({}, req.session);
    req.session.groupPage = '';
    req.session.flashMessage = '';
    req.session.flashMessageCSV = '';
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
    const groupListData = await groupRepository.getGroups(tempSession.groupPage || 1);
    const abc = [];
    for (let i = 0; i < groupListData.data.length; i++) {
        const leader = await userRepository.getExistUserById(Number(groupListData.data[i].group_leader_id));
        abc.push(Object.assign(Object.assign({}, groupListData.data[i]), { group_leader_name: (leader === null || leader === void 0 ? void 0 : leader.name) || '', created_date_display: (0, moment_1.default)(groupListData.data[i].created_date)
                .add(1, 'day')
                .format('DD/MM/YYYY'), updated_date_display: (0, moment_1.default)(groupListData.data[i].updated_date)
                .add(1, 'day')
                .format('DD/MM/YYYY'), deleted_date_display: groupListData.data[i].deleted_date
                ? (0, moment_1.default)(groupListData.data[i].deleted_date)
                    .add(1, 'day')
                    .format('DD/MM/YYYY')
                : '' }));
    }
    const totalPage = Math.ceil(groupListData.count / 10);
    let pageArray = [];
    if (totalPage < 6) {
        pageArray = lodash_1.default.range(1, totalPage + 1);
    }
    else {
        if ((tempSession.groupPage || 1) < 5) {
            pageArray = lodash_1.default.range(1, 6);
        }
        if ((tempSession.groupPage || 1) >= 5) {
            if ((tempSession.groupPage || 1) <= totalPage - 4) {
                pageArray = lodash_1.default.range(tempSession.groupPage || 1, (tempSession.groupPage || 1) + 5);
                console.log('hello');
            }
            else {
                pageArray = lodash_1.default.range(totalPage - 4, totalPage + 1);
            }
        }
    }
    const fullPageArray = lodash_1.default.range(1, totalPage + 1);
    req.session.flashMessage = '';
    res.render('groupList/index', {
        layout: 'layout/defaultLayout',
        pageTitle: 'Group List',
        usernameHeader: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name,
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
    });
};
exports.renderGroupList = renderGroupList;
const postGroupList = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    req.session.groupPage = Number(req.body.page);
    res.redirect('/group');
};
exports.postGroupList = postGroupList;
const isNumeric = (value) => {
    const parsedNumber = Number(value);
    return !isNaN(parsedNumber) && Number.isInteger(parsedNumber);
};
exports.isNumeric = isNumeric;
const checkHeaderCSV = async (headerName) => {
    return (JSON.stringify(headerName) ===
        JSON.stringify([
            'ID',
            'Group Name',
            'Group Note',
            'Group Leader',
            'Floor Number',
            'Delete',
        ]));
};
exports.checkHeaderCSV = checkHeaderCSV;
const checkRequiredCSV = async (errorTextArr, row, rowNumber) => {
    if (row['Delete'] != 'Y' && !row['ID'] && !row['Group Name']) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT001('Group Name')));
    }
    if (row['Delete'] != 'Y' && !row['ID'] && !row['Group Leader']) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT001('Group Leader')));
    }
    if (row['Delete'] != 'Y' && !row['ID'] && !row['Floor Number']) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT001('Floor Number')));
    }
};
exports.checkRequiredCSV = checkRequiredCSV;
const checkFormatCSV = async (errorTextArr, row, rowNumber) => {
    if (row['ID'] && !(0, exports.isNumeric)(row['ID'])) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT010('ID')));
    }
    if (row['Group Leader'] && !(0, exports.isNumeric)(row['Group Leader'])) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT010('Group Leader')));
    }
    if (row['Floor Number'] && !(0, exports.isNumeric)(row['Floor Number'])) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT010('Floor Number')));
    }
};
exports.checkFormatCSV = checkFormatCSV;
const checkMaxLengthCSV = async (errorTextArr, row, rowNumber) => {
    if (row['Group Name'] && row['Group Name'].length > 255) {
        errorTextArr.push(constants_1.messages.messageCSV(rowNumber, constants_1.messages.EBT002('Group Name', 255, row['Group Name'].length)));
    }
};
exports.checkMaxLengthCSV = checkMaxLengthCSV;
const importCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('missing file');
        }
        const results = [];
        let headerCSV = [];
        const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
        const filePath = path_1.default.join(__dirname, '../../', req.file.path);
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', data => {
            results.push(data);
        })
            .on('headers', async (headers) => {
            headerCSV = headers;
        })
            .on('end', async () => {
            fs_1.default.unlinkSync(req.file.path);
            const errorTextArr = [];
            if (await (0, exports.checkHeaderCSV)(headerCSV)) {
                for (let i = 0; i < results.length; i++) {
                    const row = results[i];
                    (0, exports.checkRequiredCSV)(errorTextArr, row, i);
                    (0, exports.checkFormatCSV)(errorTextArr, row, i);
                    (0, exports.checkMaxLengthCSV)(errorTextArr, row, i);
                    if (row['ID'] && (0, exports.isNumeric)(row['ID'])) {
                        const existGroup = await groupRepository.getGroupById(Number(row['ID']));
                        if (!existGroup) {
                            errorTextArr.push(constants_1.messages.messageCSV(i, constants_1.messages.EBT094(row['ID'].toString())));
                        }
                    }
                }
            }
            else {
                req.session.flashMessage = constants_1.messages.EBT095();
                res.redirect('/group');
                return;
            }
            // can import csv
            if (!errorTextArr ||
                (Array.isArray(errorTextArr) && errorTextArr.length === 0)) {
                try {
                    await (0, typeorm_1.getConnection)().transaction(async (transactionalEntityManager) => {
                        for (const row of results) {
                            if (row['ID']) {
                                if (row['Delete'] == 'Y') {
                                    //delete group
                                    const deleteGroup = {
                                        deleted_date: new Date(),
                                    };
                                    await transactionalEntityManager.update(group_entity_1.Group, row['ID'], deleteGroup);
                                }
                                else {
                                    //update group
                                    const updateGroup = {};
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
                                        await transactionalEntityManager.update(group_entity_1.Group, row['ID'], updateGroup);
                                    }
                                }
                            }
                            else {
                                //create group
                                const insertGroup = {
                                    name: row['Group Name'],
                                    note: row['Group Note'],
                                    group_leader_id: row['Group Leader'],
                                    group_floor_number: row['Floor Number'],
                                    created_date: new Date(),
                                    updated_date: new Date(),
                                };
                                await transactionalEntityManager.insert(group_entity_1.Group, insertGroup);
                            }
                        }
                    });
                    res.redirect('/group');
                }
                catch (error) {
                    console.log('error: ', error);
                }
            }
            else {
                req.session.flashMessageCSV = errorTextArr;
                res.redirect('/group');
            }
        });
    }
    catch (error) {
        console.log('error: ', error);
    }
};
exports.importCSV = importCSV;
//# sourceMappingURL=group.controller.js.map