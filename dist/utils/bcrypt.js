"use strict";
// HashPassword using bcryptjs
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const bcryptjs_2 = require("bcryptjs");
const hashPassword = async (password) => {
    const salt = await (0, bcryptjs_1.genSalt)(10);
    return (0, bcryptjs_1.hash)(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = async (providedPass, storedPass) => {
    const passwordIsMatched = await (0, bcryptjs_2.compare)(providedPass, storedPass);
    return passwordIsMatched;
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bcrypt.js.map