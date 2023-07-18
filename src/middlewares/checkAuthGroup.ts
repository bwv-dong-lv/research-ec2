import {NextFunction, Request, Response} from 'express';

export const checkAuthGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) {
    if (req.session.user.position_id === 0) {
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
