"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = exports.logError = exports.logInfo = void 0;
const winston_1 = __importDefault(require("../winston"));
const request_ip_1 = __importDefault(require("request-ip"));
/**
 * Write info log
 * @param req
 * @param message
 */
const logInfo = async (req, message) => {
    winston_1.default.info(`[${request_ip_1.default.getClientIp(req) || ''}][${req.sessionID}][${(req.user
        ? req.user.id
        : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
        ''}][${req.protocol || ''}][${message || ''}]`);
};
exports.logInfo = logInfo;
/**
 * Write error log
 * @param req
 * @param error
 */
const logError = async (req, error) => {
    winston_1.default.error(`[${request_ip_1.default.getClientIp(req) || ''}][${req.sessionID}][${(req.user
        ? req.user.id
        : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
        ''}][${req.protocol || ''}][${error}]`);
};
exports.logError = logError;
/**
 * Write warning log
 * @param req
 * @param error
 */
const logWarning = async (req, message) => {
    winston_1.default.log('warn', `[${request_ip_1.default.getClientIp(req) || ''}][${req.sessionID}][${(req.user
        ? req.user.id
        : '') || ''}][Route: ${req.originalUrl || ''}][${req.method ||
        ''}][${req.protocol || ''}][${message}]`);
};
exports.logWarning = logWarning;
//# sourceMappingURL=logger.js.map