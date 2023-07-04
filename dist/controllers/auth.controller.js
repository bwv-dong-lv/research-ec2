"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.renderLogin = void 0;
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repositories/user.repository");
const constants_1 = require("../constants");
const bcrypt_1 = require("../utils/bcrypt");
/**
 * GET login
 */
const renderLogin = async (req, res, next) => {
    res.render('login/index', {
        layout: 'layout/loginLayout',
        form: {
            email: '',
            password: '',
        },
        flashMessage: '',
    });
};
exports.renderLogin = renderLogin;
/**
 * POST login
 */
const login = async (req, res, next) => {
    try {
        const userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
        const { email, password } = req.body;
        const user = await userRepository.getUserByEmail(req.body.email);
        if (user && (await (0, bcrypt_1.comparePassword)(req.body.password, user.password))) {
            req.session.user = user;
            res.redirect('/user');
        }
        else {
            res.render('login/index', {
                layout: 'layout/loginLayout',
                form: {
                    email: email,
                    password: password,
                },
                flashMessage: constants_1.messages.EBT016(),
            });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    req.session.destroy(function (err) { });
    const redirectURL = '/login';
    // if (req.query.redirect !== undefined) {
    //   redirectURL += `?redirect=${encodeURIComponent(
    //     req.query.redirect!.toString(),
    //   )}`;
    // }
    res.redirect(redirectURL);
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map