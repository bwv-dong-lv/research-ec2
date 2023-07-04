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
// @ts-nocheck
/**
 * ユーザーミドルウェア
 */
const configEnv = __importStar(require("dotenv"));
const http_status_1 = require("http-status");
configEnv.config();
exports.default = async (req, res, next) => {
    const apiEndpoint = process.env.API_ENDPOINT || '';
    const userSession = req.session === undefined ? undefined : req.session.user;
    if (userSession === undefined) {
        req.user = {
            id: undefined,
            userName: undefined,
            isAuthorized: false,
            getServiceOption: () => ({
                endpoint: apiEndpoint,
            }),
            destroy: () => undefined, // 何もしない
        };
        res.locals.loginUser = {};
        res.locals.logoutRedirect = {};
        if (req.xhr) {
            res.status(http_status_1.UNAUTHORIZED).json({ success: false, message: 'unauthorized' });
        }
        else {
            next();
        }
    }
    else {
        req.user = Object.assign(Object.assign({}, userSession), { isAuthorized: true, destroy: () => {
                req.session.user = undefined; // ユーザーセッションを削除
            } });
        res.locals = {
            loginUser: req.user,
            logoutRedirect: encodeURIComponent(req.originalUrl),
        }; // レイアウトに使ってる
        next();
    }
};
//# sourceMappingURL=user.js.map