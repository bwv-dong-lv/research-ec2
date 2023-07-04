"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceEmptyStringRequired = exports.replaceNumber = exports.replaceEmptyString = void 0;
/**
 *
 * @param someObj
 * @param replaceValue
 */
/**
 * TODO
 * @param someObj
 * @param replaceValue
 */
const replaceEmptyString = (someObj, replaceValue) => {
    const replacer = (key, value) => String(value) === '' ? replaceValue : value;
    return JSON.parse(JSON.stringify(someObj, replacer));
};
exports.replaceEmptyString = replaceEmptyString;
/**
 * Convert string -> number of properties (type=number)
 * @param someObj
 * @param types
 */
const replaceNumber = (someObj, types) => {
    const replacer = (key, value) => typeof types.definition &&
        types.definition.properties[key] &&
        (types.definition.properties[key].type == 'number' ||
            types.definition.properties[key].type == 'interger')
        ? value && !isNaN(value)
            ? Number(value)
            : null
        : value;
    return JSON.parse(JSON.stringify(someObj, replacer));
};
exports.replaceNumber = replaceNumber;
/**
 * TODO
 * @param someObj
 * @param replaceValue
 */
const replaceEmptyStringRequired = (someObj, replaceValue, types) => {
    const replacer = (key, value) => typeof types.definition &&
        types.definition.properties[key] &&
        types.definition.properties[key].type == 'string' &&
        types.definition.properties[key].required &&
        String(value) === ''
        ? replaceValue
        : value;
    return JSON.parse(JSON.stringify(someObj, replacer));
};
exports.replaceEmptyStringRequired = replaceEmptyStringRequired;
//# sourceMappingURL=common.js.map