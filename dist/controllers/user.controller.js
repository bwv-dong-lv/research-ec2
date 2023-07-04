"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderUserList = void 0;
/**
 * GET user add
 */
const renderUserList = async (req, res, next) => {
    var _a;
    if (!req.session.user) {
        res.redirect('/login');
    }
    res.render('userList/index', {
        layout: 'layout/defaultLayout',
        username: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name,
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
exports.renderUserList = renderUserList;
//# sourceMappingURL=user.controller.js.map