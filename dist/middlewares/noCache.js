"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
function noCache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}
exports.noCache = noCache;
//# sourceMappingURL=noCache.js.map