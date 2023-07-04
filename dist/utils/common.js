"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExtract = exports.equalsCheckArray = exports.isNumeric = exports.numberWithCommas = exports.getEnumKeyByEnumValue = exports.getCurrentSystemDatetime = exports.toStringDatetime = exports.toStringDate = exports.combineText = exports.addCommaToNumber = exports.formatDate = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const big_js_1 = __importDefault(require("big.js"));
/**
 * Format date
 * @param date
 */
const formatDate = (date, format) => {
    return date && !isNaN(new Date(date)) ? (0, moment_timezone_1.default)(date).format(format) : '';
};
exports.formatDate = formatDate;
/**
 * addCommaToNumber
 * @param string
 */
const addCommaToNumber = (x) => {
    if (x === null || x === undefined) {
        return '';
    }
    try {
        const amount = new big_js_1.default(x).toFixed();
        const parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (parts[1] !== undefined) {
            parts[1] = parts[1].slice(0, 2);
        }
        return parts.join('.');
    }
    catch (_) {
        return '';
    }
};
exports.addCommaToNumber = addCommaToNumber;
/*
 * Concatenate string text
 */
const combineText = (data, char) => {
    const arr = data.filter(d => d !== undefined && d !== null);
    if (arr.length === 0) {
        return null;
    }
    if (arr.join('') === '') {
        return null;
    }
    if (arr.length > 0) {
        if (char) {
            return arr.filter(d => d).join(char);
        }
        else {
            return arr.filter(d => d).join(' ');
        }
    }
    else {
        return null;
    }
};
exports.combineText = combineText;
/**
 * Display date under a specific format
 * @param format
 * @param date
 */
function toStringDate(date, format) {
    format = format || 'YYYY/MM/DD';
    return date
        ? (0, moment_timezone_1.default)(date)
            .tz('Asia/Tokyo')
            .format(format)
        : date;
}
exports.toStringDate = toStringDate;
/**
 * Display date-time under a specific format
 * @param format
 * @param date
 */
function toStringDatetime(date, format) {
    format = format || 'YYYY/MM/DD HH:mm:ss';
    return date
        ? (0, moment_timezone_1.default)(date)
            .tz('Asia/Tokyo')
            .format(format)
        : date;
}
exports.toStringDatetime = toStringDatetime;
/**
 * Get current system date time
 */
function getCurrentSystemDatetime() {
    return (0, moment_timezone_1.default)()
        .tz('Asia/Tokyo')
        .format('YYYY/MM/DD HH:mm:ss');
}
exports.getCurrentSystemDatetime = getCurrentSystemDatetime;
const getEnumKeyByEnumValue = (myEnum, enumValue) => {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : '';
};
exports.getEnumKeyByEnumValue = getEnumKeyByEnumValue;
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
exports.numberWithCommas = numberWithCommas;
const isNumeric = (value) => {
    return /^\d+$/.test(value);
};
exports.isNumeric = isNumeric;
const equalsCheckArray = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};
exports.equalsCheckArray = equalsCheckArray;
const fileExtract = (filename) => {
    return filename && filename.split('.').pop();
};
exports.fileExtract = fileExtract;
//# sourceMappingURL=common.js.map