"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExist = void 0;
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
const checkExist = async (req, res, next) => {
    if (req.session.user) {
        const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
        const user = await userRepository.checkUserExist(Number(req.session.user.id));
        if (user) {
            next();
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            req.session.destroy(function (err) { });
            res.redirect('login');
        }
    }
    else {
        res.redirect('/login');
    }
};
exports.checkExist = checkExist;
//# sourceMappingURL=checkExist.js.map