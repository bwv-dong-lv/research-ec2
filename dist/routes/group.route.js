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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Group Router
 */
const express_1 = require("express");
const groupController = __importStar(require("../controllers/group.controller"));
const noCache_1 = require("../middlewares/noCache");
const multer_1 = __importDefault(require("multer"));
const checkAuthGroup_1 = require("../middlewares/checkAuthGroup");
const groupRouter = (0, express_1.Router)();
groupRouter.get('/group', [checkAuthGroup_1.checkAuthGroup, noCache_1.noCache], groupController.renderGroupList);
groupRouter.post('/group', [checkAuthGroup_1.checkAuthGroup, noCache_1.noCache], groupController.postGroupList);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploads = (0, multer_1.default)({
    storage: storage,
});
groupRouter.post('/upload', [checkAuthGroup_1.checkAuthGroup, uploads.single('csvFile')], groupController.importCSV);
exports.default = groupRouter;
//# sourceMappingURL=group.route.js.map