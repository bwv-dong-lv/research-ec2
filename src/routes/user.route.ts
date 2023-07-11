/**
 * User Router
 */
import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';
import {checkAuthCRUD} from '../middlewares/checkAuthCRUD';

const userRouter = Router();

userRouter.get('/user', [checkUser, noCache], userController.renderUserList);
userRouter.post('/user', [checkUser, noCache], userController.searchUser);

userRouter.get('/user/export-csv', [checkUser], userController.exportCSV);

userRouter.get(
  '/user/crud/:userId',
  [checkAuthCRUD, noCache],
  userController.renderUserAddEditDelete,
);

userRouter.get(
  '/user/crud',
  [checkAuthCRUD, noCache],
  userController.renderUserAddEditDelete,
);

userRouter.post('/user/add', [checkUser, noCache], userController.addUser);

userRouter.post(
  '/user/update',
  [checkUser, noCache],
  userController.updateUser,
);

userRouter.post(
  '/user/delete',
  [checkUser, noCache],
  userController.deleteUser,
);

export default userRouter;
