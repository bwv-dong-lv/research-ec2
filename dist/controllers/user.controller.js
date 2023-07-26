"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.canEmailUpdate = exports.isSelfEmail = exports.addUser = exports.renderUserAddEditDelete = exports.exportCSV = exports.searchUser = exports.renderUserList = void 0;
const user_entity_1 = require("../entities/user.entity");
const lodash_1 = __importDefault(require("lodash"));
const plainjs_1 = require("@json2csv/plainjs");
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
const constants_1 = require("../constants");
const group_repository_1 = require("../repositories/group.repository");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const bcrypt_1 = require("../utils/bcrypt");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
/**
 * GET user list
 */
function convertDateFormat(dateString) {
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
const renderUserList = async (req, res, next) => {
    var _a, _b;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const tempSession = Object.assign({}, req.session);
    req.session.flashMessage = '';
    req.session.searchInfo = '';
    if (tempSession.searchInfo === undefined || tempSession.searchInfo === '') {
        res.render('userList/index', {
            layout: 'layout/defaultLayout',
            pageTitle: 'User List',
            usernameHeader: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name,
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
    }
    else {
        const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
        const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
        const userListData = await userRepository.findUsers(tempSession.searchInfo.username, tempSession.searchInfo.fromDate &&
            convertDateFormat(tempSession.searchInfo.fromDate), tempSession.searchInfo.toDate &&
            convertDateFormat(tempSession.searchInfo.toDate), tempSession.searchInfo.page);
        const groupList = await groupRepository.getAllGroup();
        userListData.data.forEach((user) => {
            user.position_name = user_entity_1.UserRole[Number(user.position_id)];
            const group = groupList.find(group => group.id == user.group_id);
            user.group_name = group ? group.name : '';
            user.started_date_display = (0, moment_1.default)(user.started_date)
                .add(1, 'day')
                .format('DD/MM/YYYY');
        });
        const totalPage = Math.ceil(userListData.count / 10);
        let pageArray = [];
        if (totalPage < 6) {
            pageArray = lodash_1.default.range(1, totalPage + 1);
        }
        else {
            if (Number(tempSession.searchInfo.page) < 5) {
                pageArray = lodash_1.default.range(1, 6);
            }
            if (Number(tempSession.searchInfo.page) >= 5) {
                if (Number(tempSession.searchInfo.page <= totalPage - 4)) {
                    pageArray = lodash_1.default.range(Number(tempSession.searchInfo.page), Number(tempSession.searchInfo.page) + 5);
                }
                else {
                    pageArray = lodash_1.default.range(Number(totalPage - 4), totalPage + 1);
                }
            }
        }
        const fullPageArray = lodash_1.default.range(1, totalPage + 1);
        res.render('userList/index', {
            layout: 'layout/defaultLayout',
            pageTitle: 'User List',
            usernameHeader: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.name,
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
exports.renderUserList = renderUserList;
/**
 * POST user list
 */
const searchUser = async (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    req.session.searchInfo = {
        username: req.body.username,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        page: req.body.page,
    };
    if (req.body.usernameOrigin != req.body.username ||
        req.body.fromDateOrigin != req.body.fromDate ||
        req.body.toDateOrigin != req.body.toDate) {
        req.session.searchInfo.page = 1;
    }
    res.redirect('/user');
};
exports.searchUser = searchUser;
function getCurrentDateTimeString() {
    const currentDate = (0, moment_1.default)().utcOffset(7);
    const formattedDate = currentDate.format('YYYYMMDDHHmmss');
    const newFileName = 'list_user_' + formattedDate;
    return newFileName;
}
const exportCSV = async (req, res, next) => {
    var _a;
    try {
        const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
        const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
        const groupList = await groupRepository.getAllGroup();
        const userListCSVData = await userRepository.getAllUsers(req.session.search.username, req.session.search.fromDate &&
            convertDateFormat(req.session.search.fromDate), req.session.search.toDate && convertDateFormat(req.session.search.toDate));
        const positionNameArr = ['Director', 'Group Leader', 'Leader', 'Member'];
        userListCSVData.data.forEach((user) => {
            user.position_name = positionNameArr[Number(user.position_id)];
            const group = groupList.find(group => group.id == user.group_id);
            user.group_name = group ? group.name : '';
            user.started_date_display = (0, moment_1.default)(user.started_date)
                .add(1, 'day')
                .format('DD/MM/YYYY');
            user.created_date_display = (0, moment_1.default)(user.created_date)
                .add(1, 'day')
                .format('DD/MM/YYYY');
            user.updated_date_display = (0, moment_1.default)(user.updated_date)
                .add(1, 'day')
                .format('DD/MM/YYYY');
        });
        const parser = new plainjs_1.Parser();
        const usersDownload = (_a = userListCSVData.data) === null || _a === void 0 ? void 0 : _a.map((item) => ({
            id: item.id.toString(),
            name: item.name,
            email: item.email,
            group_id: item.group_id,
            group_name: item.group_name,
            started_date: item.started_date_display.toString(),
            position: item.position_name,
            created_date: item.created_date_display && item.created_date_display.toString(),
            updated_date: item.updated_date_display && item.updated_date_display.toString(),
        }));
        const fields = [
            { label: 'ID', value: 'id' },
            { label: 'User\u00A0Name', value: 'name' },
            { label: 'Email', value: 'email' },
            { label: 'Group\u00A0ID', value: 'group_id' },
            { label: 'Group\u00A0Name', value: 'group_name' },
            { label: 'Started\u00A0Date', value: 'started_date' },
            { label: 'Position', value: 'position' },
            { label: 'Created\u00A0Date', value: 'created_date' },
            { label: 'Updated\u00A0Date', value: 'updated_date' },
        ];
        const json2csvParser = new plainjs_1.Parser({ fields, withBOM: true });
        const csv = json2csvParser.parse(usersDownload);
        // const csv = parser.parse(usersDownload);
        const filename = getCurrentDateTimeString();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        res.status(200).end(csv);
    }
    catch (err) {
        console.error(err);
    }
};
exports.exportCSV = exportCSV;
/**
 * GET user add edit delete
 */
const renderUserAddEditDelete = async (req, res, next) => {
    var _a, _b, _c, _d;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
    const groupList = await groupRepository.getAllGroup();
    const tempSession = Object.assign({}, req.session);
    req.session.flashMessage = '';
    // update user
    if (req.params.userId) {
        const userInfo = await userRepository.getUserById(req.params.userId);
        if (userInfo.deleted_date) {
            res.status(404);
            // respond with html page
            if (req.accepts('html')) {
                res.render('errors/index', {
                    layout: 'layout/notFoundLayout',
                    title: '404 Page Not Found',
                    content: '',
                });
                return;
            }
            if (req.accepts('json')) {
                res.json({ error: 'Not found' });
                return;
            }
            res.type('txt').send('Not found');
        }
        if (userInfo) {
            const group = await groupRepository.getGroupById(userInfo.group_id);
            userInfo.started_date = (0, moment_1.default)(userInfo.started_date)
                .add(1, 'day')
                .format('DD/MM/YYYY');
            userInfo.password = ((_a = tempSession.updateUserInfo) === null || _a === void 0 ? void 0 : _a.password) || '';
            userInfo.email = ((_b = tempSession.updateUserInfo) === null || _b === void 0 ? void 0 : _b.email) || userInfo.email;
            req.session.updateUserInfo = '';
            res.render('userEditDelete/index', {
                layout: 'layout/defaultLayout',
                pageTitle: 'User Update Delete',
                userInfo: userInfo,
                groupId: (group === null || group === void 0 ? void 0 : group.id) || -1,
                groupList: groupList,
                positionId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.position_id,
                loginUser: req.session.user,
                flashMessage: tempSession.flashMessage ? tempSession.flashMessage : '',
            });
        }
    }
    else {
        req.session.addUserInfo = '';
        //add user
        res.render('userAdd/index', {
            layout: 'layout/defaultLayout',
            pageTitle: 'User Add',
            userInfo: tempSession.addUserInfo || '',
            groupId: ((_c = tempSession.addUserInfo) === null || _c === void 0 ? void 0 : _c.groupId) || -1,
            groupList: groupList,
            positionId: ((_d = tempSession.addUserInfo) === null || _d === void 0 ? void 0 : _d.positionId) || -1,
            loginUser: req.session.user,
            flashMessage: tempSession.flashMessage ? tempSession.flashMessage : '',
        });
    }
};
exports.renderUserAddEditDelete = renderUserAddEditDelete;
function stringToDate(inputString) {
    const dateParts = inputString.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 to convert to zero-based month
    const year = parseInt(dateParts[2], 10);
    return new Date(year, month, day);
}
const addUser = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id) {
        const loginUser = await userRepository.getUserById(req.session.user.id);
        if ((loginUser === null || loginUser === void 0 ? void 0 : loginUser.position_id) !== 0) {
            req.session.destroy(function () { });
            res.redirect('/login');
            return;
        }
    }
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
        req.session.flashMessage = constants_1.messages.EBT019();
        res.redirect('/user/crud');
    }
    else {
        // create success
        const user = {
            email: req.body.email,
            password: await (0, bcrypt_1.hashPassword)(req.body.password),
            name: req.body.username,
            group_id: req.body.group,
            // started_date: new Date(req.body.startedDate),
            started_date: stringToDate(req.body.startedDate),
            position_id: req.body.position,
            created_date: new Date(),
            updated_date: new Date(),
        };
        try {
            await userRepository.createUser(user);
            req.session.flashMessage = constants_1.messages.EBT096();
            res.redirect('/user/crud');
        }
        catch (error) {
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
            req.session.flashMessage = constants_1.messages.EBT093();
            res.redirect('/user/crud');
        }
    }
};
exports.addUser = addUser;
const isSelfEmail = async (email, emailCheck) => {
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const user = await userRepository.getUserByEmail(email);
    const userCheck = await userRepository.getUserByEmail(emailCheck);
    if (user && userCheck && user.id === userCheck.id) {
        return true;
    }
    return false;
};
exports.isSelfEmail = isSelfEmail;
const canEmailUpdate = async (email) => {
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const user = await userRepository.getUserByEmail(email);
    return user ? false : true;
};
exports.canEmailUpdate = canEmailUpdate;
const updateUser = async (req, res, next) => {
    var _a, _b, _c;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.position_id) != 0 &&
        ((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id) == req.body.userId) {
        const user = {
            password: req.body.password
                ? await (0, bcrypt_1.hashPassword)(req.body.password)
                : undefined,
            updated_date: new Date(),
        };
        try {
            await userRepository.updateUser(req.body.userId, user);
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
            req.session.flashMessage = constants_1.messages.EBT096();
            res.redirect(`/user/crud/${Number(req.body.userId)}`);
            return;
        }
        catch (error) {
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
            req.session.flashMessage = constants_1.messages.EBT093();
            res.redirect(`/user/crud/${req.body.userId}`);
            return;
        }
    }
    if ((_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id) {
        const loginUser = await userRepository.getUserById(req.session.user.id);
        if ((loginUser === null || loginUser === void 0 ? void 0 : loginUser.position_id) !== 0) {
            req.session.destroy(function () { });
            res.redirect('/login');
            return;
        }
    }
    const groupList = await groupRepository.getAllGroup();
    const userUpdate = await userRepository.getUserById(req.body.userId);
    if (userUpdate) {
        if (await (0, exports.isSelfEmail)(req.body.email, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.email)) {
            // update giu nguyen email
            const parts = req.body.startedDate.split('/');
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            // Format the date components into MySQL date format (YYYY-DD-MM)
            const mysqlDate = `${year}-${month}-${day}`;
            const user = {
                password: req.body.password
                    ? await (0, bcrypt_1.hashPassword)(req.body.password)
                    : undefined,
                name: req.body.username,
                group_id: req.body.group,
                started_date: new Date(mysqlDate),
                position_id: req.body.position,
                updated_date: new Date(),
            };
            try {
                await userRepository.updateUser(req.body.userId, user);
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
                req.session.flashMessage = constants_1.messages.EBT096();
                res.redirect(`/user/crud/${req.body.userId}`);
            }
            catch (error) {
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
                req.session.flashMessage = constants_1.messages.EBT093();
                res.redirect(`/user/crud/${req.body.userId}`);
            }
        }
        else {
            // update user with email
            if (await (0, exports.canEmailUpdate)(req.body.email)) {
                // can update with email
                const parts = req.body.startedDate.split('/');
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];
                // Format the date components into MySQL date format (YYYY-DD-MM)
                const mysqlDate = `${year}-${month}-${day}`;
                const user = {
                    email: req.body.email,
                    password: req.body.password
                        ? await (0, bcrypt_1.hashPassword)(req.body.password)
                        : undefined,
                    name: req.body.username,
                    group_id: req.body.group,
                    started_date: new Date(mysqlDate),
                    position_id: req.body.position,
                    updated_date: new Date(),
                };
                try {
                    await userRepository.updateUser(req.body.userId, user);
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
                    req.session.flashMessage = constants_1.messages.EBT096();
                    res.redirect(`/user/crud/${req.body.userId}`);
                }
                catch (error) {
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
                    req.session.flashMessage = constants_1.messages.EBT093();
                    res.redirect(`/user/crud/${req.body.userId}`);
                }
            }
            else {
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
                req.session.flashMessage = constants_1.messages.EBT019();
                res.redirect(`/user/crud/${req.body.userId}`);
            }
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
    const groupList = await groupRepository.getAllGroup();
    if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id) {
        const loginUser = await userRepository.getUserById(req.session.user.id);
        if ((loginUser === null || loginUser === void 0 ? void 0 : loginUser.position_id) !== 0) {
            req.session.destroy(function () { });
            res.redirect('/login');
            return;
        }
    }
    try {
        await userRepository.deleteUserById(req.body.userId, new Date());
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
        req.session.flashMessage = constants_1.messages.EBT096();
        res.redirect('/user');
    }
    catch (error) {
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
        req.session.flashMessage = constants_1.messages.EBT093();
        res.redirect(`/user/crud/${req.body.userId}`);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map