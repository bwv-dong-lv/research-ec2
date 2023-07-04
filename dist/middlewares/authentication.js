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
 * Authentication Middlewares
 */
const logger = __importStar(require("../utils/logger"));
const http_status_1 = require("http-status");
/**
 * If the user is not authorized, then redirect to login page
 */
exports.default = async (req, res, next) => {
    if (!req.user.isAuthorized) {
        res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
    else {
        try {
            if (!req.xhr) {
                // Audit log every action
                logger.logInfo(req);
            }
            next();
        }
        catch (err) {
            if (err.response && err.response.status === http_status_1.UNAUTHORIZED) {
                logger.logWarning(req, err);
                res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
                return;
            }
            else {
                next();
            }
        }
    }
};
//# sourceMappingURL=authentication.js.map