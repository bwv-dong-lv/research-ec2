import {NextFunction, Request, Response} from 'express';
import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';

export const checkExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.checkUserExist(
      Number(req.session.user.id),
    );

    if (user) {
      next();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      req.session.destroy(function(err) {});
      res.redirect('login');
    }
  } else {
    res.redirect('/login');
  }
};
