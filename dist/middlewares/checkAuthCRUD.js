"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthCRUD = void 0;
const checkAuthCRUD = async (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.position_id === 0) {
            next();
        }
        else {
            if (String(req.session.user.id) == String(req.params.userId)) {
                next();
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                req.session.destroy(function (err) { });
                res.redirect('login');
            }
        }
    }
    else {
        res.redirect('/login');
    }
};
exports.checkAuthCRUD = checkAuthCRUD;
//# sourceMappingURL=checkAuthCRUD.js.map