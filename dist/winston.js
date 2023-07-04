"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const moment = require("moment-timezone");
const { combine, printf } = winston_1.format;
/**
 * winston logger configuration
 * levels: fatal, error, warning, info, debug
 * format: [Timestamp][log level][IP][sessionID][userID][message]
 */
const logger = (0, winston_1.createLogger)({
    format: combine(printf((info) => {
        if (info && info.level == 'warn') {
            return `[${moment()
                .tz('Asia/Tokyo')
                .format()}][WARNING]${info.message}`;
        }
        else {
            return `[${moment()
                .tz('Asia/Tokyo')
                .format()}][${info.level.toUpperCase()}]${info.message}`;
        }
    })),
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: () => `[${(moment().format())}]`,
            datePattern: 'YYYYMMDD',
            filename: `application_%DATE%.log`,
            dirname: 'logs'
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=winston.js.map