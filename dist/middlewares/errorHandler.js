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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonErrorProcess = void 0;
const http_status_1 = require("http-status");
const logger = __importStar(require("../utils/logger"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonErrorProcess = (err, req, res) => {
    let status = http_status_1.BAD_REQUEST;
    if (err.response !== undefined) {
        status = err.response.status;
    }
    if (status === http_status_1.UNAUTHORIZED) {
        logger.logWarning(req, err);
        res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
        return;
    }
};
exports.commonErrorProcess = commonErrorProcess;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default (err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err && (!err.code || err.code !== 'ERR_HTTP_HEADERS_SENT')) {
//     logger.logError(req, err);
//   }
//   let title = titleMessageError.INTERNAL_SERVER_ERROR;
//   let error = messages.INTERNAL_SERVER_ERROR;
//   let status = BAD_REQUEST;
//   if (err.response !== undefined) {
//     status = err.response.status;
//     if (status === NOT_FOUND) {
//       res.render('errors/index', {
//         title: titleMessageError.NOT_FOUND,
//         content: messages.NOT_FOUND,
//       });
//       return;
//     }
//     if (status === INTERNAL_SERVER_ERROR) {
//       res.render('errors/index', {
//         title: titleMessageError.INTERNAL_SERVER_ERROR,
//         content: messages.INTERNAL_SERVER_ERROR,
//       });
//       return;
//     }
//     if (status === FORBIDDEN) {
//       res.render('errors/index', {
//         title: titleMessageError.FORBIDDEN,
//         content: messages.FORBIDDEN,
//       });
//       return;
//     }
//     if (status === UNAUTHORIZED) {
//       res.redirect(`/logout?redirect=${encodeURIComponent(req.originalUrl)}`);
//       return;
//     }
//     status = err.response.status;
//     error += `data: ${JSON.stringify(err.response.data)}`;
//     title = messages.BAD_REQUEST;
//   }
//   const userSession = req.session === undefined ? undefined : req.session.user;
//   res.status(status).render('errors/index', {
//     title,
//     content: error,
//     layout:
//       userSession === undefined
//         ? 'layout/noLoginLayout'
//         : 'layout/defaultLayout',
//   });
//   next();
// };
exports.default = (req, res, next) => {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.render('errors/index', {
            layout: 'layout/notFoundLayout',
            title: '404 Page Not Found',
            content: '',
        });
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
};
//# sourceMappingURL=errorHandler.js.map