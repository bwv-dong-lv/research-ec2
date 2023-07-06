"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main Router
 */
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const group_route_1 = __importDefault(require("./group.route"));
const checkAuth_1 = require("../middlewares/checkAuth");
const test_route_1 = __importDefault(require("./test.route"));
const router = (0, express_1.Router)();
// router.use(sessionMiddleWare);
// router.use(userMiddleware);
router.use('/', auth_route_1.default);
router.use('/', [checkAuth_1.checkUser], user_route_1.default);
router.use('/', [checkAuth_1.checkUser], group_route_1.default);
router.use('/', test_route_1.default);
// router.use(auth);
// router.use(viewHelper);
// router.get('/', (req, res) => {
//   res.render('index');
// });
exports.default = router;
//# sourceMappingURL=index.js.map