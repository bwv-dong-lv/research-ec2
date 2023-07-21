/**
 * User Router
 */
import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';
import {checkAuthCRUD} from '../middlewares/checkAuthCRUD';
import {checkExist} from '../middlewares/checkExist';

const userRouter = Router();

userRouter.get('/user', [checkExist, noCache], userController.renderUserList);
userRouter.post(
  '/user',
  [checkUser, noCache, checkExist],
  userController.searchUser,
);

userRouter.get(
  '/user/export-csv',
  [checkUser, checkExist],
  userController.exportCSV,
);

userRouter.get(
  '/user/crud/:userId',
  [checkAuthCRUD, noCache, checkExist],
  userController.renderUserAddEditDelete,
);

userRouter.get(
  '/user/crud',
  [checkAuthCRUD, noCache, checkExist],
  userController.renderUserAddEditDelete,
);

userRouter.post(
  '/user/add',
  [checkUser, noCache, checkExist],
  userController.addUser,
);

userRouter.post(
  '/user/update',
  [checkUser, noCache, checkExist],
  userController.updateUser,
);

userRouter.post(
  '/user/delete',
  [checkUser, noCache, checkExist],
  userController.deleteUser,
);

export default userRouter;
