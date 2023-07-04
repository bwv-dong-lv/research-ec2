"use strict";
// @ts-nocheck
/**
 * セッションミドルウェア
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (req, _, next) => {
    req.consumeSession = () => {
        let formData;
        if (req.session.formData !== undefined) {
            formData = Object.assign({}, req.session.formData);
        }
        let message;
        if (req.session.message !== undefined) {
            message = Object.assign({}, req.session.message);
        }
        req.session.formData = undefined;
        req.session.message = undefined;
        return { formData, message };
    };
    next();
};
//# sourceMappingURL=session.js.map