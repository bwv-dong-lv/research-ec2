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
const userRouter = (0, express_1.Router)();
userRouter.get('/user', [checkAuth_1.checkUser, noCache_1.noCache], userController.renderUserList);
userRouter.post('/user', [checkAuth_1.checkUser, noCache_1.noCache], userController.searchUser);
userRouter.get('/user/export-csv', [checkAuth_1.checkUser], userController.exportCSV);
userRouter.get('/user/:userId', [checkAuth_1.checkUser, noCache_1.noCache], userController.renderUserAddEditDelete);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map