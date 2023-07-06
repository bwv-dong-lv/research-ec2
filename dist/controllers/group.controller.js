"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGroupList = void 0;
/**
 * GET group
 */
const renderGroupList = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    res.render('groupList/index', {
        layout: 'layout/defaultLayout',
        pageTitle: 'Group List',
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
exports.renderGroupList = renderGroupList;
//# sourceMappingURL=group.controller.js.map