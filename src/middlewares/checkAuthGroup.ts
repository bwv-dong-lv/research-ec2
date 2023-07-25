import {NextFunction, Request, Response} from 'express';
import {UserRepository} from '../repositories/user.repository';
import {getCustomRepository} from 'typeorm';

export const checkAuthGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.checkUserExist(req.session.user.id);

    if (user?.position_id === 0) {
      next();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      req.session.destroy(function(err) {});
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
};
