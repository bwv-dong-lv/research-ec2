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
exports.permission = void 0;
const constants_1 = require("../constants");
const logger = __importStar(require("../utils/logger"));
/**
 * List of roles to be able to access to the screen
 * @param roles
 */
const permission = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role || 0)) {
            logger.logWarning(req, `権限エラー`);
            res.render('errors/index', {
                title: constants_1.titleMessageError.FORBIDDEN,
                content: constants_1.messages.FORBIDDEN,
            });
            return;
        }
        next();
    };
};
exports.permission = permission;
//# sourceMappingURL=screenPermission.js.map