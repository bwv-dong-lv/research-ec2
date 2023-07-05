"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCSV = exports.renderUserAddEditDelete = exports.searchUser = exports.renderUserList = void 0;
const user_entity_1 = require("../entities/user.entity");
const lodash_1 = __importDefault(require("lodash"));
const plainjs_1 = require("@json2csv/plainjs");
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
const constants_1 = require("../constants");
const group_repository_1 = require("../repositories/group.repository");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
/**
 * GET user list
 */
const renderUserList = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
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
        flashMessage: '',
    });
};
exports.renderUserList = renderUserList;
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
/**
 * POST user list
 */
const searchUser = async (req, res, next) => {
    var _a, _b;
    if (!req.session.user) {
        res.redirect('/login');
    }
    console.log((0, dayjs_1.default)(req.body.fromDate).isBefore((0, dayjs_1.default)(req.body.toDate)));
    if (req.body.fromDate && req.body.toDate) {
        if (!(0, dayjs_1.default)(req.body.fromDate).isBefore((0, dayjs_1.default)(req.body.toDate))) {
            res.render('userList/index', {
                layout: 'layout/defaultLayout',
                pageTitle: 'User List',
                usernameHeader: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name,
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
                flashMessage: constants_1.messages.EBT044(),
            });
        }
    }
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    const groupRepository = (0, typeorm_1.getCustomRepository)(group_repository_1.GroupRepository);
    const userListData = await userRepository.findUsers(req.body.username, req.body.fromDate && convertDateFormat(req.body.fromDate), req.body.toDate && convertDateFormat(req.body.toDate), req.body.page);
    const groupList = await groupRepository.getAllGroup();
    userListData.data.forEach((user) => {
        user.position_name = user_entity_1.UserRole[Number(user.position_id)];
        const group = groupList.find(group => group.id == user.group_id);
        user.group_name = group ? group.name : '';
        user.started_date_display = (0, dayjs_1.default)(user.started_date).format('DD/MM/YYYY');
    });
    const userListCSVData = await userRepository.getAllUsers(req.body.username, req.body.fromDate && convertDateFormat(req.body.fromDate), req.body.toDate && convertDateFormat(req.body.toDate));
    const positionNameArr = ['Director', 'Group Leader', 'Leader', 'Member'];
    userListCSVData.data.forEach((user) => {
        user.position_name = positionNameArr[Number(user.position_id)];
        const group = groupList.find(group => group.id == user.group_id);
        user.group_name = group ? group.name : '';
        user.started_date_display = dayjs_1.default
            .utc(user.started_date)
            .format('DD/MM/YYYY');
        user.created_date_display = (0, dayjs_1.default)(user.created_date).format('DD/MM/YYYY');
        user.updated_date_display = (0, dayjs_1.default)(user.updated_date).format('DD/MM/YYYY');
    });
    req.session.userListCSV = userListCSVData.data;
    const totalPage = Math.ceil(userListData.count / 10);
    let pageArray = [];
    if (totalPage < 6) {
        pageArray = lodash_1.default.range(1, totalPage + 1);
    }
    else {
        if (Number(req.body.page) < 5) {
            pageArray = lodash_1.default.range(1, 6);
        }
        if (Number(req.body.page) >= 5) {
            if (Number(req.body.page <= totalPage - 4)) {
                pageArray = lodash_1.default.range(Number(req.body.page), Number(req.body.page) + 5);
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
exports.searchUser = searchUser;
/**
 * GET user add edit delete
 */
const renderUserAddEditDelete = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    res.render('userAddEditDelete/index', {
        layout: 'layout/defaultLayout',
        pageTitle: 'UserAddEditDelete',
        usernameHeader: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name,
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
exports.renderUserAddEditDelete = renderUserAddEditDelete;
const exportCSV = async (req, res, next) => {
    var _a;
    try {
        const parser = new plainjs_1.Parser();
        const usersDownload = (_a = req.session.userListCSV) === null || _a === void 0 ? void 0 : _a.map((item) => ({
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
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.status(200).end(csv);
    }
    catch (err) {
        console.error(err);
    }
};
exports.exportCSV = exportCSV;
//# sourceMappingURL=user.controller.js.map