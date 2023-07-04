"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
const checkUser = async (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.checkUser = checkUser;
// export const checkAuthAdminSupport = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.session.user?.id;
//     const userRepository = getCustomRepository(UserRepository);
//     if (userId) {
//       const user = await userRepository.getUserById(userId);
//       if (
//         user?.user_flg === UserFlag.Admin ||
//         user?.user_flg === UserFlag.Support
//       ) {
//         next();
//       } else {
//         res.redirect('/admin/login');
//       }
//     }
//   } catch (err) {
//     res.redirect('/admin/login');
//   }
// };
// export const checkAuthAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.session.user?.id;
//     const userRepository = getCustomRepository(UserRepository);
//     if (userId) {
//       const user = await userRepository.getUserById(userId);
//       if (user?.user_flg === UserFlag.Admin) {
//         next();
//       } else {
//         res.redirect('/admin');
//       }
//     }
//   } catch (err) {
//     res.redirect('/admin/login');
//   }
// };
//# sourceMappingURL=checkAuth.js.map