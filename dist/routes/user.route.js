"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User Router
 */
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const noCache_1 = require("../middlewares/noCache");
const checkAuth_1 = require("../middlewares/checkAuth");
const checkAuthCRUD_1 = require("../middlewares/checkAuthCRUD");
const checkExist_1 = require("../middlewares/checkExist");
const userRouter = (0, express_1.Router)();
userRouter.get('/user', [checkExist_1.checkExist, noCache_1.noCache], userController.renderUserList);
userRouter.post('/user', [checkAuth_1.checkUser, noCache_1.noCache, checkExist_1.checkExist], userController.searchUser);
userRouter.get('/user/export-csv', [checkAuth_1.checkUser, checkExist_1.checkExist], userController.exportCSV);
userRouter.get('/user/crud/:userId', [checkAuthCRUD_1.checkAuthCRUD, noCache_1.noCache, checkExist_1.checkExist], userController.renderUserAddEditDelete);
userRouter.get('/user/crud', [checkAuthCRUD_1.checkAuthCRUD, noCache_1.noCache, checkExist_1.checkExist], userController.renderUserAddEditDelete);
userRouter.post('/user/add', [checkAuth_1.checkUser, noCache_1.noCache, checkExist_1.checkExist], userController.addUser);
userRouter.post('/user/update', [checkAuth_1.checkUser, noCache_1.noCache, checkExist_1.checkExist], userController.updateUser);
userRouter.post('/user/delete', [checkAuth_1.checkUser, noCache_1.noCache, checkExist_1.checkExist], userController.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map