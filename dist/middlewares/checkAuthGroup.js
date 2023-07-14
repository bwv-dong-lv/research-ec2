"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthGroup = void 0;
const checkAuthGroup = async (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.position_id === 0) {
            next();
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            req.session.destroy(function (err) { });
            res.redirect('/login');
        }
    }
    else {
        res.redirect('/login');
    }
};
exports.checkAuthGroup = checkAuthGroup;
//# sourceMappingURL=checkAuthGroup.js.map