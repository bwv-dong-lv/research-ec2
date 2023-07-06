/**
 * User Router
 */
import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';

const userRouter = Router();

userRouter.get('/user', [checkUser, noCache], userController.renderUserList);
userRouter.post('/user', [checkUser, noCache], userController.searchUser);

userRouter.get('/user/export-csv', [checkUser], userController.exportCSV);

userRouter.get(
  '/user/:userId',
  [checkUser, noCache],
  userController.renderUserAddEditDelete,
);

export default userRouter;
