import {NextFunction, Request, Response} from 'express';

export const checkAuthCRUD = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) {
    if (req.session.user.position_id === 0) {
      next();
    } else {
      if (req.session.user.id == Number(req.params.userId)) {
        next();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        req.session.destroy(function(err) {});
        res.redirect('login');
      }
    }
  } else {
    res.redirect('/login');
  }
};
