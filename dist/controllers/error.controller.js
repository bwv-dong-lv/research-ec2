"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const constants_1 = require("../constants");
const notFound = (req, res) => {
    if (req.user.id !== undefined) {
        res.render('errors/index', {
            title: constants_1.titleMessageError.NOT_FOUND,
            content: constants_1.messages.NOT_FOUND,
        });
        return;
    }
    else {
        res.redirect('/login');
    }
};
exports.notFound = notFound;
//# sourceMappingURL=error.controller.js.map