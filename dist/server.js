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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
require("./LoadEnv");
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const routes_1 = __importDefault(require("./routes"));
const moment = __importStar(require("moment-timezone"));
require("./connection");
moment.tz.setDefault('Asia/Tokyo');
const app = (0, express_1.default)();
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'ejs');
app.use(express_ejs_layouts_1.default);
app.set('layout extractScripts', true);
// app.set('layout', 'layout/defaultLayout');
app.use((0, serve_favicon_1.default)(`${__dirname}/../public/favicon.ico`));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 10000 }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
    },
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(`${__dirname}/../`));
app.use(routes_1.default);
app.use(errorHandler_1.default);
app.set('trust proxy', true);
module.exports = app;
//# sourceMappingURL=server.js.map