"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthGroup = void 0;
const user_repository_1 = require("../repositories/user.repository");
const typeorm_1 = require("typeorm");
const checkAuthGroup = async (req, res, next) => {
    if (req.session.user) {
        const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
        const user = await userRepository.checkUserExist(req.session.user.id);
        if ((user === null || user === void 0 ? void 0 : user.position_id) === 0) {
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