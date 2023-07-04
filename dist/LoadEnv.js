"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const command_line_args_1 = __importDefault(require("command-line-args"));
const winston_1 = __importDefault(require("./winston"));
winston_1.default.info(`NODE_ENV: ${process.env.NODE_ENV || ''}`);
if (process.env.NODE_ENV) {
    // Set the env file
    const result = dotenv_1.default.config({
        path: `./env/${process.env.NODE_ENV}.env`,
    });
    if (result.error) {
        throw result.error;
    }
}
else {
    // Setup command line options
    const options = (0, command_line_args_1.default)([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'local',
            type: String,
        },
    ]);
    // Set the env file
    const result = dotenv_1.default.config({
        path: `./env/${options.env}.env`,
    });
    if (result.error) {
        throw result.error;
    }
}
//# sourceMappingURL=LoadEnv.js.map