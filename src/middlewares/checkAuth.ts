import {NextFunction, Request, Response} from 'express';

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

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
