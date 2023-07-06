"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
/**
 * GET user list
 */
const test = async (req, res, next) => {
    const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    // for (let i = 77; i <= 100; i++) {
    //   const user: Partial<User> = {
    //     email: `dong${i}@yahoo.com`,
    //     password: await hashPassword(`dong${i}`),
    //     name: `dong lun${i}`,
    //     group_id: 1,
    //     started_date: new Date(),
    //     position_id: 3,
    //     created_date: new Date(),
    //     updated_date: new Date(),
    //   };
    //   try {
    //     await userRepository.createUser(user);
    //   } catch (error) {
    //     console.log('error: ', error);
    //   }
    // }
};
exports.test = test;
//# sourceMappingURL=test.controller.js.map