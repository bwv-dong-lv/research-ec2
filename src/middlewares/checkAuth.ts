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
