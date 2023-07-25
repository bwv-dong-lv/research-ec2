"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
const checkUser = async (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.checkUser = checkUser;
//# sourceMappingURL=checkAuth.js.map