"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const winston_1 = __importDefault(require("./winston"));
(0, typeorm_1.createConnection)({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [__dirname + '/entities/*.entity.js'],
    synchronize: false,
    timezone: '+09:00',
})
    .then(connection => {
    winston_1.default.info('Database connected.');
})
    .catch(error => {
    winston_1.default.error(error);
    winston_1.default.error('Error establishing a database connection.');
});
//# sourceMappingURL=connection.js.map