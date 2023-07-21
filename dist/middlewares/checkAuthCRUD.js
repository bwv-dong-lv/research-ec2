"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthCRUD = void 0;
const checkAuthCRUD = async (req, res, next) => {
    console.log('req session: ', req.session);
    if (req.session.user) {
        if (req.session.user.position_id === 0) {
            next();
        }
        else {
            if (req.session.user.id == Number(req.params.userId)) {
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